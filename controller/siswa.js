import prisma from "../lib/db.js";

export const createSiswa = async (req, res) => {
  const { nama, semester, kelompok, guruId } = req.body;
  const numberSemester = +semester;

  try {
    const isExist = await prisma.siswa.findMany({
      where: {
        nama,
        kelompok,
        semester: numberSemester,
        guruId: +guruId, // tambahkan pengecekan siswa hanya dari guru ini
      },
    });

    if (isExist.length !== 0) {
      return res.status(409).json({
        message: "Siswa sudah terdaftar oleh Anda",
      });
    }

    const newSiswa = await prisma.siswa.create({
      data: {
        nama,
        kelompok,
        semester: numberSemester,
        guru: { connect: { id: +guruId } }, // ← tambahkan ini untuk menyimpan relasi guru
      },
    });

    return res.status(201).json({
      message: "Berhasil menambahkan siswa",
      data: newSiswa,
    });
  } catch (error) {
    console.log(error);
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
    });

    return res.status(200).json({ data: siswas });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteSiswa = async (req, res) => {
  const siswaId = +req.params.siswaId;
  const { guruId } = req.body; // ⬅️ frontend harus kirim guruId

  try {
    const siswa = await prisma.siswa.findUnique({ where: { id: siswaId } });

    if (!siswa || siswa.guruId !== +guruId) {
      return res.status(403).json({ message: "Tidak diizinkan menghapus siswa ini" });
    }

    await prisma.siswa.delete({ where: { id: siswaId } });

    return res.status(200).json({ message: "Berhasil menghapus siswa" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Terjadi kesalahan saat menghapus siswa.",
    });
  }
};
