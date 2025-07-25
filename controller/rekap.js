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

  if (!siswaId) {
    return res.status(400).json({ message: "siswaId wajib diisi" });
  }

  try {
    const data = await prisma.nilai.groupBy({
      by: ["id_modul"],
      where: {
        id_siswa: parseInt(siswaId),
      },
      _count: { id: true },
      _avg: { nilai: true },
    });

    const result = await Promise.all(data.map(async (d) => {
      const modul = await prisma.modul.findUnique({
        where: { id: d.id_modul },
      });

      const createdAt = await prisma.nilai.findFirst({
        where: {
          id_modul: d.id_modul,
          id_siswa: parseInt(siswaId),
        },
        orderBy: { createdAt: "asc" },
      });

      const mingguKe = createdAt ? Math.ceil((new Date(createdAt.createdAt).getDate()) / 7) : 0;

      return {
        mingguKe,
        modul: modul?.nama || "Tidak diketahui",
        jumlah: d._count.id,
        rataRata: parseFloat((d._avg.nilai ?? 0).toFixed(1)),
      };
    }));

    res.json(result);
  } catch (error) {
    console.error("Gagal mengambil rekap mingguan per siswa:", error);
    res.status(500).json({ message: "Gagal mengambil rekap mingguan per siswa" });
  }
};