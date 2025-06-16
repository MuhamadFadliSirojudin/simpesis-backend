import prisma from "../lib/db.js";

export const createSiswa = async (req, res) => {
  const { nama, semester, kelompok, guruId } = req.body;
  const numberSemester = +semester;

  try {
    // Validasi guruId dikirim
    if (!guruId) {
      return res.status(400).json({
        message: "ID guru wajib dikirim",
      });
    }

    // Cek apakah guru dengan ID tersebut ada
    const guru = await prisma.guru.findUnique({
      where: { id: +guruId },
    });

    if (!guru) {
      return res.status(404).json({
        message: "ID guru tidak ditemukan",
      });
    }

    // Cek apakah siswa sudah ada untuk guru tersebut
    const isExist = await prisma.siswa.findMany({
      where: {
        nama,
        kelompok,
        semester: numberSemester,
        guruId: +guruId,
      },
    });

    if (isExist.length !== 0) {
      return res.status(409).json({
        message: "Siswa sudah terdaftar oleh Anda",
      });
    }

    // Tambah siswa dan kaitkan dengan guru
    const newSiswa = await prisma.siswa.create({
      data: {
        nama,
        kelompok,
        semester: numberSemester,
        guru: { connect: { id: +guruId } },
      },
    });

    return res.status(201).json({
      message: "Berhasil menambahkan siswa",
      data: newSiswa,
    });
  } catch (error) {
    console.log("❌ Error createSiswa:", error);
    return res.status(500).json({
      message: "Gagal menambahkan siswa",
    });
  }
};


export const getAllSiswa = async (req, res) => {
  const { semester, nama, guruId } = req.query;

  try {
    const siswas = await prisma.siswa.findMany({
      where: {
        ...(guruId && { guruId: Number(guruId) }),
        ...(semester && { semester: Number(semester) }),
        ...(nama && { nama: { contains: nama, mode: "insensitive" } }),
      },
      include: {
      nilai: true, // ⬅️ ambil data nilai
      },
    });

    const processed = siswas.map((s) => ({
        ...s,
        totalNilai: s.nilai.length,
      }
    ));

    return res.status(200).json({ data: processed });
  } catch (err) {
    console.error("Error getAllSiswa:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const deleteSiswa = async (req, res) => {
  const siswaId = +req.params.siswaId;
  const guruId = +req.query.guruId;

  try {
    // pastikan siswa memang milik guru yang login
    const siswa = await prisma.siswa.findFirst({
      where: {
        id: siswaId,
        guruId,
      },
    });

    if (!siswa) {
      return res.status(404).json({ message: "Siswa tidak ditemukan atau bukan milik Anda" });
    }

    await prisma.siswa.delete({
      where: {
        id: siswaId,
      },
    });

    return res.status(200).json({ message: "Berhasil menghapus siswa" });
  } catch (error) {
    console.log("Error delete siswa:", error);
    return res.status(500).json({ error: "Gagal menghapus siswa" });
  }
};

export const getSiswaById = async (req, res) => {
  const { id } = req.params;

  try {
    const siswa = await prisma.siswa.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        nama: true,
      },
    });

    if (!siswa) {
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    }

    return res.status(200).json({ data: siswa });
  } catch (error) {
    console.error("Gagal mengambil siswa:", error);      return res.status(500).json({ message: "Gagal mengambil siswa" });
  }
};
