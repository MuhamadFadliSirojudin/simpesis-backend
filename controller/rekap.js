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
          modulNama: item.modul?.topik || "Tidak diketahui", // Atau .nama jika kamu pakai nama
          jumlah: 0,
          totalNilai: 0,
          createdAt: item.createdAt,
        };
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

// /controller/rekap.js

export const getLaporanMingguan = async (req, res) => {
  const siswaId = parseInt(req.query.siswaId);

  const siswa = await prisma.siswa.findUnique({
    where: { id: siswaId },
    include: {
      kelas: true, // jika ada
    },
  });

  const nilai = await prisma.nilai.findMany({
    where: { id_siswa: siswaId },
    include: { modul: true },
    orderBy: { createdAt: "asc" },
  });

  const grouped = {};
  for (const item of nilai) {
    const id = item.id_modul;
    if (!grouped[id]) {
      grouped[id] = {
        modul: item.modul?.topik ?? "Tidak diketahui",
        kegiatan: item.modul?.tujuan ?? "-",
        jumlah: 0,
        total: 0,
        tanggal: item.createdAt,
      };
    }
    grouped[id].jumlah++;
    grouped[id].total += item.nilai;

    if (item.createdAt < grouped[id].tanggal) {
      grouped[id].tanggal = item.createdAt;
    }
  }

  const rekap = Object.values(grouped).map((g) => ({
    mingguKe: Math.ceil(g.tanggal.getDate() / 7),
    modul: g.modul,
    kegiatan: g.kegiatan,
    jumlah: g.jumlah,
    rataRata: parseFloat((g.total / g.jumlah).toFixed(1)),
  }));

  res.json({
    siswa: {
      nama: siswa.nama,
      waliKelas: siswa.waliKelas || "Bu Siti",
      fase: siswa.fase || "Kelompok A",
    },
    rekap,
  });
};
