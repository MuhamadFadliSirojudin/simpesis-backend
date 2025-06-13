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
    const gurus = await prisma.guru.findMany({
      select: { id: true, nama: true, username: true, nuptk: true }
    });
    res.json({ data });
  } catch (err) {
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
            nilai: true
          }
        }
      }
    });

    const hasil = guruList.map((guru) => {
      const totalSiswa = guru.siswa.length;
      const siswaDinilai = guru.siswa.filter((s) => s.nilai.length > 0).length;
      const persentase = totalSiswa === 0 ? 0 : Math.round((siswaDinilai / totalSiswa) * 100);

      return {
        id: guru.id,
        nama: guru.nama,
        totalSiswa,
        siswaDinilai,
        persentase
      };
    });

    res.json(hasil);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data kinerja guru" });
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
