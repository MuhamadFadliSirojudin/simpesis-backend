import prisma from "../lib/db.js";

export const createGuru = async (req, res) => {
  const { nama, username, password, nuptk } = req.body;

  try {
    const exist = await prisma.guru.findUnique({ where: { username } });
    if (exist) {
      return res.status(409).json({ message: "Username sudah digunakan" });
    }

    const guru = await prisma.guru.create({
      data: {
        nama,
        username,
        password,
        nuptk,
        role: "guru"
      }
    });

    res.status(201).json(guru);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menambahkan guru" });
  }
};

export const getAllGuru = async (req, res) => {
  try {
    const result = await prisma.guru.findMany();
    res.json({ data: result });
  } catch (error) {
    console.error("❌ Error getAllGuru:", error);
    res.status(500).json({ message: "Gagal mengambil data guru" });
  }
};

export const deleteGuruById = async (req, res) => {
  const id = +req.params.id;
  try {
    await prisma.guru.delete({ where: { id } });
    res.json({ message: "Guru dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus guru" });
  }
};

export const getGuruKinerja = async (req, res) => {
  try {
    const guruList = await prisma.guru.findMany({
      include: {
        siswa: {
          include: {
            nilai: true,
          },
        },
      },
    });

    const totalModul = await prisma.modul.count();

    const result = guruList.map((guru) => {
      const jumlahSiswa = guru.siswa.length;
      const totalNilai = guru.siswa.reduce(
        (sum, s) => sum + s.nilai.length,
        0
      );
      const targetNilai = jumlahSiswa * totalModul;
      const progress =
        targetNilai > 0 ? ((totalNilai / targetNilai) * 100).toFixed(1) : 0;

      return {
        nama: guru.nama,
        jumlahSiswa,
        totalNilai,
        targetNilai,
        progress,
      };
    });

    res.status(200).json({ data: result });
  } catch (error) {
    console.error("getGuruKinerja error:", error);
    res.status(500).json({ message: "Gagal mengambil kinerja guru" });
  }
};

export const updateGuru = async (req, res) => {
  const id = +req.params.id;
  const { nama, username, nuptk, password } = req.body;

  try {
    const updated = await prisma.guru.update({
      where: { id },
      data: {
        nama,
        username,
        nuptk,
        ...(password && { password }), // hanya update jika ada
      },
    });

    res.json({ message: "Guru berhasil diperbarui", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui guru" });
  }
};
