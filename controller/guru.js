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
            nilai: true, // ambil nilai tiap siswa
          },
        },
      },
    });

    const totalModul = await prisma.modul.count();

    const result = guruList.map((guru) => {
      const jumlahSiswa = guru.siswa.length;

      // hitung total modul unik yang sudah dinilai per siswa
      const totalNilai = guru.siswa.reduce((sum, s) => {
        const modulUnik = new Set(s.nilai.map((n) => n.id_modul));
        return sum + modulUnik.size;
      }, 0);

      const targetNilai = jumlahSiswa * totalModul;
      let progress = targetNilai > 0 ? (totalNilai / targetNilai) * 100 : 0;

      // batasi agar tidak melebihi 100%
      if (progress > 100) progress = 100;

      return {
        nama: guru.nama,
        jumlahSiswa,
        totalNilai,
        targetNilai,
        progress: progress.toFixed(1),
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

// controller/guru.js
export const getDaftarGuru = async (req, res) => {
  try {
    const guruList = await prisma.guru.findMany({
      where: { role: "guru" },
      select: {
        id: true,
        nama: true,
        siswa: {
          select: { id: true }
        }
      }
    });

    const data = guruList.map(g => ({
      id: g.id,
      nama: g.nama,
      jumlahSiswa: g.siswa.length
    }));

    res.json({ data });
  } catch (err) {
    console.error("Gagal mengambil daftar guru", err);
    res.status(500).json({ message: "Gagal mengambil daftar guru" });
  }
};
