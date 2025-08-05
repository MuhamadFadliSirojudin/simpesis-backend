import prisma from "../lib/db.js";

//Konsep Harian
export const getRekapHarian = async (req, res) => {
  try {
    const nilai = await prisma.nilai.findMany({
      select: {
        id: true,
        id_siswa: true,
        nilai: true,
        createdAt: true,
      },
    });

    const grouped = nilai.reduce((acc, curr) => {
      const tanggal = curr.createdAt.toISOString().split("T")[0]; // YYYY-MM-DD
      const key = `${curr.id_siswa}`;

      if (!acc[key]) {
        acc[key] = {
          id_siswa: curr.id_siswa,
          tanggal,
          jumlah: 0,
          total: 0,
        };
      }

      acc[key].jumlah += 1;
      acc[key].total += curr.nilai;

      return acc;
    }, {});

    const siswaIds = [...new Set(Object.values(grouped).map((g) => g.id_siswa))];

    const siswaData = await prisma.siswa.findMany({
      where: { id: { in: siswaIds } },
      select: { id: true, nama: true },
    });

    const result = Object.values(grouped).map((g) => {
      const siswa = siswaData.find((s) => s.id === g.id_siswa);
      return {
        id_siswa: g.id_siswa,
        nama_siswa: siswa?.nama || "Tidak diketahui",
        tanggal: g.tanggal,
        jumlah_nilai: g.total,
        rata_rata: parseFloat((g.total / g.jumlah).toFixed(1)),
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Gagal mengambil rekap harian:", error);
    res.status(500).json({ message: "Gagal mengambil rekap harian" });
  }
};

export const getRekapHarianBySiswa = async (req, res) => {
  const { siswaId } = req.query;

  const siswaIdInt = parseInt(siswaId);
  if (isNaN(siswaIdInt)) {
    return res.status(400).json({ message: "siswaId wajib diisi dengan angka yang valid" });
  }

  try {
    const nilaiData = await prisma.nilai.findMany({
      where: {
        id_siswa: siswaIdInt,
      },
      include: {
        modul: true,
        pembelajaran: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const grouped = {};

    for (const item of nilaiData) {
      const tanggal = item.createdAt.toISOString().split("T")[0]; // format: YYYY-MM-DD
      const modulId = item.id_modul;
      const key = `${modulId}-${tanggal}`;

      if (!grouped[key]) {
        grouped[key] = {
          tanggal,
          modul: item.modul?.topik || item.modul?.nama || "Tidak diketahui",
          kegiatanList: [],
          jumlah: 0,
          total: 0,
        };
      }

      grouped[key].jumlah += 1;
      grouped[key].total += item.nilai;

      if (item.pembelajaran?.nama) {
        grouped[key].kegiatanList.push({
          nama: item.pembelajaran.nama,
          nilai: item.nilai,
        });
      }
    }

    const result = Object.values(grouped).map((item) => ({
      tanggal: item.tanggal,
      modul: item.modul,
      kegiatanList: item.kegiatanList,
      jumlah: item.total,
      rataRata: parseFloat((item.total / item.jumlah).toFixed(1)),
    }));

    res.json(result);
  } catch (error) {
    console.error("Gagal mengambil rekap harian per siswa:", error);
    res.status(500).json({ message: "Gagal mengambil rekap harian per siswa" });
  }
};

export const getDetailRekapHarianBySiswa = async (req, res) => {
  const { siswaId } = req.query;

  const siswaIdInt = parseInt(siswaId);
  if (isNaN(siswaIdInt)) {
    return res.status(400).json({ message: "siswaId wajib diisi dengan angka yang valid" });
  }

  try {
    const nilaiData = await prisma.nilai.findMany({
      where: {
        id_siswa: siswaIdInt,
      },
      include: {
        modul: true,
        pembelajaran: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const grouped = {};

    for (const item of nilaiData) {
      const tanggal = item.createdAt.toISOString().split("T")[0]; // format YYYY-MM-DD
      const modul = item.modul?.topik || item.modul?.nama || "-";
      const key = `${tanggal}-${modul}`;

      if (!grouped[key]) {
        grouped[key] = {
          tanggal,
          modul,
          jumlah: 0,
          totalNilai: 0,
          kegiatanList: [],
        };
      }

      grouped[key].jumlah++;
      grouped[key].totalNilai += item.nilai;
      grouped[key].kegiatanList.push({
        nama: item.pembelajaran?.nama || "-",
        nilai: item.nilai,
      });
    }

    const result = Object.values(grouped).map((item) => ({
      tanggal: item.tanggal,
      modul: item.modul,
      jumlah: item.totalNilai,
      rataRata: parseFloat((item.totalNilai / item.jumlah).toFixed(1)),
      kegiatanList: item.kegiatanList,
    }));

    res.json(result);
  } catch (error) {
    console.error("Gagal mengambil detail rekap harian:", error);
    res.status(500).json({ message: "Gagal mengambil detail rekap harian" });
  }
};

export const getLaporanHarian = async (req, res) => {
  const { siswaId } = req.query;

  const siswaIdInt = parseInt(siswaId);
  if (isNaN(siswaIdInt)) {
    return res.status(400).json({ message: "siswaId tidak valid" });
  }

  try {
    const siswa = await prisma.siswa.findUnique({
      where: { id: siswaIdInt },
      include: { guru: true },
    });

    const data = await prisma.nilai.findMany({
      where: { id_siswa: siswaIdInt },
      include: {
        modul: true,
        pembelajaran: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const grouped = {};

    data.forEach((item) => {
      const tanggal = item.createdAt.toISOString().split("T")[0];
      const key = `${item.id_modul}-${tanggal}`;

      if (!grouped[key]) {
        grouped[key] = {
          tanggal,
          modul: item.modul?.topik || item.modul?.nama || "Tidak diketahui",
          jumlahKegiatan: 0,
          totalNilai: 0,
          kegiatanList: [],
        };
      }

      grouped[key].jumlahKegiatan += 1;
      grouped[key].totalNilai += item.nilai;
      grouped[key].kegiatanList.push({
        nama: item.pembelajaran?.nama || "-",
        nilai: item.nilai,
      });
    });

    const rekap = Object.values(grouped).map((item) => ({
      tanggal: item.tanggal,
      modul: item.modul,
      jumlah: item.totalNilai, // jumlah nilai total semua kegiatan
      rataRata: parseFloat((item.totalNilai / item.jumlahKegiatan).toFixed(1)),
      kegiatanList: item.kegiatanList,
    }));

    res.json({ siswa, rekap });
  } catch (err) {
    console.error("Gagal ambil laporan harian:", err);
    res.status(500).json({ message: "Gagal ambil laporan harian" });
  }
};

//Konsep Mingguan
export const getRekapMingguan = async (req, res) => {
  try {
    const data = await prisma.nilai.groupBy({
      by: ["id_siswa"],
      _count: { id: true },
      _avg: { nilai: true },
    });

    const siswaData = await prisma.siswa.findMany({
      where: {
        id: { in: data.map((d) => d.id_siswa) },
      },
      select: {
        id: true,
        nama: true,
      },
    });

    const result = data.map((d) => {
      const siswa = siswaData.find((s) => s.id === d.id_siswa);
      return {
        id_siswa: d.id_siswa,
        nama_siswa: siswa?.nama || "Tidak diketahui",
        jumlah_nilai: d._count.id,
        rata_rata: parseFloat((d._avg.nilai ?? 0).toFixed(1)),
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Gagal mengambil rekap mingguan:", error);
    res.status(500).json({ message: "Gagal mengambil rekap mingguan" });
  }
};

export const getRekapMingguanBySiswa = async (req, res) => {
  const { siswaId } = req.query;

  const siswaIdInt = parseInt(siswaId);
  if (isNaN(siswaIdInt)) {
    return res.status(400).json({ message: "siswaId wajib diisi dengan angka yang valid" });
  }

  try {
    const nilaiData = await prisma.nilai.findMany({
      where: {
        id_siswa: siswaIdInt,
      },
      include: {
        modul: true,
        pembelajaran: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const grouped = {};

    for (const item of nilaiData) {
      const modulId = item.id_modul;
      if (!grouped[modulId]) {
        grouped[modulId] = {
          modulNama: item.modul?.topik || item.modul?.nama || "Tidak diketahui",
          kegiatanSet: new Set(),
          jumlah: 0,
          totalNilai: 0,
          createdAt: item.createdAt,
        };
      }

      // Tambahkan nama kegiatan jika ada
      if (item.pembelajaran?.nama) {
        grouped[modulId].kegiatanSet.add(item.pembelajaran.nama);
      }

      grouped[modulId].jumlah++;
      grouped[modulId].totalNilai += item.nilai;

      if (item.createdAt < grouped[modulId].createdAt) {
        grouped[modulId].createdAt = item.createdAt;
      }
    }

    const result = Object.values(grouped).map((d) => {
      const mingguKe = Math.ceil(new Date(d.createdAt).getDate() / 7);
      return {
        mingguKe,
        modul: d.modulNama,
        kegiatan: [...d.kegiatanSet].join(", ") || "-",
        jumlah: d.totalNilai,
        rataRata: parseFloat((d.totalNilai / d.jumlah).toFixed(1)),
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Gagal mengambil rekap mingguan per siswa:", error);
    res.status(500).json({ message: "Gagal mengambil rekap mingguan per siswa" });
  }
};

export const getDetailRekapMingguanBySiswa = async (req, res) => {
  const { siswaId } = req.query;

  const siswaIdInt = parseInt(siswaId);
  if (isNaN(siswaIdInt)) {
    return res.status(400).json({ message: "siswaId wajib diisi dengan angka yang valid" });
  }

  try {
    const nilaiData = await prisma.nilai.findMany({
      where: {
        id_siswa: siswaIdInt,
      },
      include: {
        modul: true,
        pembelajaran: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const grouped = {};

    for (const item of nilaiData) {
      const mingguKe = Math.ceil(new Date(item.createdAt).getDate() / 7);
      const modul = item.modul?.topik || "-";
      const key = `${mingguKe}-${modul}`;

      if (!grouped[key]) {
        grouped[key] = {
          mingguKe,
          modul,
          jumlah: 0,
          totalNilai: 0,
          kegiatanList: [],
        };
      }

      grouped[key].jumlah++;
      grouped[key].totalNilai += item.nilai;
      grouped[key].kegiatanList.push({
        nama: item.pembelajaran?.nama || "-",
        nilai: item.nilai,
      });
    }

    const result = Object.values(grouped).map((item) => ({
      mingguKe: item.mingguKe,
      modul: item.modul,
      jumlah: item.totalNilai,
      rataRata: parseFloat((item.totalNilai / item.jumlah).toFixed(1)),
      kegiatanList: item.kegiatanList,
    }));

    res.json(result);
  } catch (error) {
    console.error("Gagal mengambil detail rekap mingguan:", error);
    res.status(500).json({ message: "Gagal mengambil detail rekap mingguan" });
  }
};

export const getLaporanMingguan = async (req, res) => {
  const { siswaId } = req.query;

  const siswaIdInt = parseInt(siswaId);
  if (isNaN(siswaIdInt)) {
    return res.status(400).json({ message: "siswaId tidak valid" });
  }

  const siswa = await prisma.siswa.findUnique({
    where: { id: siswaIdInt },
    include: { guru: true },
  });

  try {
    const siswa = await prisma.siswa.findUnique({
      where: { id: siswaIdInt },
      include: {
        guru: true,
      },
    });

    const data = await prisma.nilai.findMany({
      where: { id_siswa: siswaIdInt },
      include: {
        modul: true,
        pembelajaran: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Grouping berdasarkan modul dan minggu
    const grouped = {};

    data.forEach((item) => {
      const mingguKe = Math.ceil(new Date(item.createdAt).getDate() / 7);
      const key = `${item.id_modul}-${mingguKe}`;
      if (!grouped[key]) {
        grouped[key] = {
          mingguKe,
          modul: item.modul?.topik || "Tidak diketahui",
          jumlah: 0,
          total: 0,
          kegiatanList: [],
        };
      }

      grouped[key].jumlah += 1;
      grouped[key].total += item.nilai;
      grouped[key].kegiatanList.push({
        nama: item.pembelajaran?.nama || "-",
        nilai: item.nilai,
      });
    });

    const rekap = Object.values(grouped).map((item) => ({
      ...item,
      jumlah_nilai: item.total,
      rataRata: parseFloat((item.total / item.jumlah).toFixed(1)),
    }));

    res.json({ siswa, rekap });
  } catch (err) {
    console.error("Gagal ambil laporan mingguan:", err);
    res.status(500).json({ message: "Gagal ambil laporan mingguan" });
  }
};

//Konsep Bulanan
export const getRekapBulanan = async (req, res) => {
  try {
    // Ambil semua nilai dan mapping ke bulan
    const nilai = await prisma.nilai.findMany({
      select: {
        id: true,
        id_siswa: true,
        nilai: true,
        createdAt: true,
      },
    });

    // Kelompokkan berdasarkan id_siswa dan bulan
    const grouped = nilai.reduce((acc, curr) => {
      const month = new Date(curr.createdAt).getMonth() + 1; // 1-12
      const key = `${curr.id_siswa}-${month}`;

      if (!acc[key]) {
        acc[key] = {
          id_siswa: curr.id_siswa,
          bulan: month,
          jumlah: 0,
          total: 0,
        };
      }

      acc[key].jumlah += 1;
      acc[key].total += curr.nilai;
      return acc;
    }, {});

    // Ambil semua id siswa unik
    const siswaIds = [...new Set(Object.values(grouped).map((g) => g.id_siswa))];

    // Ambil data siswa
    const siswaData = await prisma.siswa.findMany({
      where: { id: { in: siswaIds } },
      select: { id: true, nama: true },
    });

    // Format hasil akhir
    const result = Object.values(grouped).map((g) => {
      const siswa = siswaData.find((s) => s.id === g.id_siswa);
      return {
        id_siswa: g.id_siswa,
        nama_siswa: siswa?.nama || "Tidak diketahui",
        bulan: g.bulan,
        jumlah_nilai: g.total,
        rata_rata: parseFloat((g.total / g.jumlah).toFixed(1)),
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Gagal mengambil rekap bulanan:", error);
    res.status(500).json({ message: "Gagal mengambil rekap bulanan" });
  }
};

export const getRekapBulananBySiswa = async (req, res) => {
  const { siswaId } = req.query;

  const siswaIdInt = parseInt(siswaId);
  if (isNaN(siswaIdInt)) {
    return res.status(400).json({ message: "siswaId wajib diisi dengan angka yang valid" });
  }

  try {
    const nilaiData = await prisma.nilai.findMany({
      where: {
        id_siswa: siswaIdInt,
      },
      include: {
        modul: true,
        pembelajaran: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const grouped = {};

    for (const item of nilaiData) {
      const bulan = new Date(item.createdAt).getMonth() + 1; // 1-12
      const modulId = item.id_modul;
      const key = `${modulId}-${bulan}`;

      if (!grouped[key]) {
        grouped[key] = {
          bulan,
          modul: item.modul?.topik || item.modul?.nama || "Tidak diketahui",
          kegiatanList: [],
          jumlah: 0,
          total: 0,
        };
      }

      if (item.pembelajaran?.nama) {
        grouped[key].kegiatanList.push({
          nama: item.pembelajaran.nama,
          nilai: item.nilai,
        });
      }

      grouped[key].jumlah += 1;
      grouped[key].total += item.nilai;
    }

    const result = Object.values(grouped).map((item) => ({
      bulan: item.bulan,
      modul: item.modul,
      kegiatanList: item.kegiatanList,
      jumlah: item.total,
      rataRata: parseFloat((item.total / item.jumlah).toFixed(1)),
    }));

    res.json(result);
  } catch (error) {
    console.error("Gagal mengambil rekap bulanan per siswa:", error);
    res.status(500).json({ message: "Gagal mengambil rekap bulanan per siswa" });
  }
};

export const getDetailRekapBulananBySiswa = async (req, res) => {
  const { siswaId } = req.query;

  const siswaIdInt = parseInt(siswaId);
  if (isNaN(siswaIdInt)) {
    return res.status(400).json({ message: "siswaId tidak valid" });
  }

  try {
    const data = await prisma.nilai.findMany({
      where: { id_siswa: siswaIdInt },
      include: {
        modul: true,
        pembelajaran: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const grouped = data.reduce((acc, curr) => {
      const modulId = curr.id_modul;
      const bulanKe = new Date(curr.createdAt).getMonth() + 1;

      const key = `${modulId}-${bulanKe}`;
      if (!acc[key]) {
        acc[key] = {
          bulanKe,
          modul: curr.modul?.topik || "Tidak diketahui",
          jumlah: 0,
          total: 0,
          kegiatanList: [],
        };
      }

      acc[key].jumlah += 1;
      acc[key].total += curr.nilai;
      acc[key].kegiatanList.push({
        nama: curr.pembelajaran?.kegiatan || "-",
        nilai: curr.nilai,
      });

      return acc;
    }, {});

    const result = Object.values(grouped).map((item) => ({
      ...item,
      jumlah_nilai: item.total,
      rataRata: parseFloat((item.total / item.jumlah).toFixed(1)),
    }));

    res.json(result);
  } catch (err) {
    console.error("Gagal ambil detail rekap bulanan:", err);
    res.status(500).json({ message: "Gagal ambil detail rekap bulanan" });
  }
};

export const getLaporanBulanan = async (req, res) => {
  const { siswaId } = req.query;

  const siswaIdInt = parseInt(siswaId);
  if (isNaN(siswaIdInt)) {
    return res.status(400).json({ message: "siswaId tidak valid" });
  }

  try {
    const siswa = await prisma.siswa.findUnique({
      where: { id: siswaIdInt },
      include: { guru: true },
    });

    const data = await prisma.nilai.findMany({
      where: { id_siswa: siswaIdInt },
      include: {
        modul: true,
        pembelajaran: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Grouping berdasarkan modul dan bulan
    const grouped = {};

    data.forEach((item) => {
      const bulan = new Date(item.createdAt).getMonth() + 1; // Januari = 1
      const key = `${item.id_modul}-${bulan}`;
      if (!grouped[key]) {
        grouped[key] = {
          bulan,
          modul: item.modul?.topik || "Tidak diketahui",
          jumlah: 0,
          total: 0,
          kegiatanList: [],
        };
      }

      grouped[key].jumlah += 1;
      grouped[key].total += item.nilai;
      grouped[key].kegiatanList.push({
        nama: item.pembelajaran?.nama || "-",
        nilai: item.nilai,
      });
    });

    const rekap = Object.values(grouped).map((item) => ({
      ...item,
      jumlah_nilai: item.total,
      rataRata: parseFloat((item.total / item.jumlah).toFixed(1)),
    }));

    res.json({ siswa, rekap });
  } catch (err) {
    console.error("Gagal ambil laporan bulanan:", err);
    res.status(500).json({ message: "Gagal ambil laporan bulanan" });
  }
};

//Konsep Semester
export const getRekapSemester = async (req, res) => {
  try {
    // Ambil semua nilai
    const nilai = await prisma.nilai.findMany({
      select: {
        id: true,
        id_siswa: true,
        nilai: true,
        createdAt: true,
      },
    });

    // Kelompokkan berdasarkan id_siswa dan semester
    const grouped = nilai.reduce((acc, curr) => {
      const month = new Date(curr.createdAt).getMonth() + 1; // 1-12
      const semester = month >= 7 ? 1 : 2; // Juli–Desember = Semester 1, Jan–Juni = Semester 2
      const key = `${curr.id_siswa}-S${semester}`;

      if (!acc[key]) {
        acc[key] = {
          id_siswa: curr.id_siswa,
          semester,
          jumlah: 0,
          total: 0,
        };
      }

      acc[key].jumlah += 1;
      acc[key].total += curr.nilai;
      return acc;
    }, {});

    // Ambil semua id siswa unik
    const siswaIds = [...new Set(Object.values(grouped).map((g) => g.id_siswa))];

    // Ambil data siswa
    const siswaData = await prisma.siswa.findMany({
      where: { id: { in: siswaIds } },
      select: { id: true, nama: true },
    });

    // Format hasil akhir
    const result = Object.values(grouped).map((g) => {
      const siswa = siswaData.find((s) => s.id === g.id_siswa);
      return {
        id_siswa: g.id_siswa,
        nama_siswa: siswa?.nama || "Tidak diketahui",
        semester: g.semester,
        jumlah_nilai: g.total,
        rata_rata: parseFloat((g.total / g.jumlah).toFixed(1)),
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Gagal mengambil rekap semester:", error);
    res.status(500).json({ message: "Gagal mengambil rekap semester" });
  }
};

export const getRekapSemesterBySiswa = async (req, res) => {
  const { siswaId } = req.query;

  const siswaIdInt = parseInt(siswaId);
  if (isNaN(siswaIdInt)) {
    return res.status(400).json({ message: "siswaId wajib diisi dengan angka yang valid" });
  }

  try {
    const nilaiData = await prisma.nilai.findMany({
      where: {
        id_siswa: siswaIdInt,
      },
      include: {
        modul: true,
        pembelajaran: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const grouped = {};

    for (const item of nilaiData) {
      const month = new Date(item.createdAt).getMonth() + 1;
      const semester = month >= 7 ? 1 : 2;
      const modulId = item.id_modul;
      const key = `${modulId}-S${semester}`;

      if (!grouped[key]) {
        grouped[key] = {
          semester,
          modul: item.modul?.topik || item.modul?.nama || "Tidak diketahui",
          kegiatanList: [],
          jumlah: 0,
          total: 0,
        };
      }

      if (item.pembelajaran?.nama) {
        grouped[key].kegiatanList.push({
          nama: item.pembelajaran.nama,
          nilai: item.nilai,
        });
      }

      grouped[key].jumlah += 1;
      grouped[key].total += item.nilai;
    }

    const result = Object.values(grouped).map((item) => ({
      semester: item.semester,
      modul: item.modul,
      kegiatanList: item.kegiatanList,
      jumlah: item.total,
      rataRata: parseFloat((item.total / item.jumlah).toFixed(1)),
    }));

    res.json(result);
  } catch (error) {
    console.error("Gagal mengambil rekap semester per siswa:", error);
    res.status(500).json({ message: "Gagal mengambil rekap semester per siswa" });
  }
};

export const getDetailRekapSemesterBySiswa = async (req, res) => {
  const { siswaId } = req.query;

  const siswaIdInt = parseInt(siswaId);
  if (isNaN(siswaIdInt)) {
    return res.status(400).json({ message: "siswaId tidak valid" });
  }

  try {
    const data = await prisma.nilai.findMany({
      where: { id_siswa: siswaIdInt },
      include: {
        modul: true,
        pembelajaran: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const grouped = data.reduce((acc, curr) => {
      const modulId = curr.id_modul;
      const month = new Date(curr.createdAt).getMonth() + 1;
      const semesterKe = month >= 7 ? 1 : 2;
      const key = `${modulId}-S${semesterKe}`;

      if (!acc[key]) {
        acc[key] = {
          semester: semesterKe,
          modul: curr.modul?.topik || curr.modul?.nama || "Tidak diketahui",
          jumlah: 0,
          total: 0,
          kegiatanList: [],
        };
      }

      acc[key].jumlah += 1;
      acc[key].total += curr.nilai;
      acc[key].kegiatanList.push({
        nama: curr.pembelajaran?.kegiatan || curr.pembelajaran?.nama || "-",
        nilai: curr.nilai,
      });

      return acc;
    }, {});

    const result = Object.values(grouped).map((item) => ({
      ...item,
      jumlah_nilai: item.total,
      rataRata: parseFloat((item.total / item.jumlah).toFixed(1)),
    }));

    res.json(result);
  } catch (err) {
    console.error("Gagal ambil detail rekap semester:", err);
    res.status(500).json({ message: "Gagal ambil detail rekap semester" });
  }
};

export const getLaporanSemester = async (req, res) => {
  const { siswaId } = req.query;

  const siswaIdInt = parseInt(siswaId);
  if (isNaN(siswaIdInt)) {
    return res.status(400).json({ message: "siswaId tidak valid" });
  }

  try {
    const siswa = await prisma.siswa.findUnique({
      where: { id: siswaIdInt },
      include: { guru: true },
    });

    const data = await prisma.nilai.findMany({
      where: { id_siswa: siswaIdInt },
      include: {
        modul: true,
        pembelajaran: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Grouping berdasarkan modul dan semester
    const grouped = {};

    data.forEach((item) => {
      const month = new Date(item.createdAt).getMonth() + 1;
      const semester = month >= 7 ? 1 : 2; // Semester 1: Juli–Desember, Semester 2: Januari–Juni
      const key = `${item.id_modul}-S${semester}`;

      if (!grouped[key]) {
        grouped[key] = {
          semester,
          modul: item.modul?.topik || item.modul?.nama || "Tidak diketahui",
          jumlah: 0,
          total: 0,
          kegiatanList: [],
        };
      }

      grouped[key].jumlah += 1;
      grouped[key].total += item.nilai;
      grouped[key].kegiatanList.push({
        nama: item.pembelajaran?.nama || item.pembelajaran?.kegiatan || "-",
        nilai: item.nilai,
      });
    });

    const rekap = Object.values(grouped).map((item) => ({
      ...item,
      jumlah_nilai: item.total,
      rataRata: parseFloat((item.total / item.jumlah).toFixed(1)),
    }));

    res.json({ siswa, rekap });
  } catch (err) {
    console.error("Gagal ambil laporan semester:", err);
    res.status(500).json({ message: "Gagal ambil laporan semester" });
  }
};
