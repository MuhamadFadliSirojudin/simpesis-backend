import prisma from "../lib/db.js";

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
        jumlah: d.jumlah,
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
      jumlah: item.jumlah,
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

  try {
    const siswa = await prisma.siswa.findUnique({
      where: { id: siswaIdInt },
    });

    const data = await prisma.nilai.findMany({
      where: { id_siswa: siswaIdInt },
      include: {
        modul: true,
        pembelajaran: true,
      },
    });

    const grouped = data.reduce((acc, curr) => {
      const modulId = curr.id_modul;
      if (!acc[modulId]) {
        acc[modulId] = {
          modul: curr.modul?.topik || "Tidak diketahui",
          kegiatan: curr.pembelajaran?.kegiatan || "-",
          jumlah: 0,
          total: 0,
          mingguKe: Math.ceil(new Date(curr.createdAt).getDate() / 7),
        };
      }
      acc[modulId].jumlah += 1;
      acc[modulId].total += curr.nilai;
      return acc;
    }, {});

    const rekap = Object.values(grouped).map((item) => ({
      ...item,
      rataRata: parseFloat((item.total / item.jumlah).toFixed(1)),
    }));

    res.json({ siswa, rekap });
  } catch (err) {
    console.error("Gagal ambil laporan mingguan:", err);
    res.status(500).json({ message: "Gagal ambil laporan mingguan" });
  }
};
