import prisma from "../lib/db.js";

export const createSiswa = async (req, res) => {
  const { nama, semester, kelompok } = req.body;
  const numberSemester = +semester;

  try {
    const isExist = await prisma.siswa.findMany({
      where: {
        nama,
        kelompok,
        semester: numberSemester,
      },
    });

    if (isExist.length !== 0) {
      return res.status(409).json({
        message: "siswa sudah terdaftar",
      });
    }

    const newSiswa = await prisma.siswa.create({
      data: {
        nama,
        kelompok,
        semester: numberSemester,
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
  const { semester, nama } = req.query;

  try {
    const siswas = await prisma.siswa.findMany({
      where: {
        ...(semester && { semester: semester }),
        ...(nama && { nama: { contains: nama, mode: "insensitive" } }),
      },
    });

    return res.status(200).json({ data: siswas });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteSiswa = async (req, res) => {
  const siswaId = req.params.siswaId;

  try {
    await prisma.siswa.delete({
      where: {
        id: +siswaId,
      },
    });

    return res.status(200).json({ message: "Berhasil menghapus siswa" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Terjadi kesalahan saat mengambil data modul." });
  }
};
