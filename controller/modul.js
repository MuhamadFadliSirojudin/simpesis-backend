import prisma from "../lib/db.js";

export const createModul = async (req, res) => {
  const { nip, penyusun, topik, tujuan } = req.body;

  try {
    const newModul = await prisma.modul.create({
      data: {
        penyusun,
        topik,
        tujuan,
        nip,
      },
    });

    return res.status(201).json({
      message: "Berhasil menambahkan modul",
      data: newModul,
    });
  } catch (error) {
    console.error("Error saat get modul:", error);
    return res
      .status(500)
      .json({ error: "Terjadi kesalahan saat mengambil data modul." });
  }
};

export const getAllModul = async (req, res) => {
  const { modulName } = req.query;

  try {
    const moduls = await prisma.modul.findMany({
      where: {
        ...(modulName && {
          topik: {
            contains: modulName,
          },
        }),
      },
    });

    return res.status(200).json({ data: moduls });
  } catch (error) {
    console.error("Error saat get modul:", error);
    return res
      .status(500)
      .json({ error: "Terjadi kesalahan saat mengambil data modul." });
  }
};

export const deleteModulById = async (req, res) => {
  const modulId = req.params.id;

  try {
    await prisma.modul.delete({
      where: {
        id: +modulId,
      },
    });

    return res.status(200).json({ message: "Berhasil menghapus modul" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Terjadi kesalahan saat mengambil data modul." });
  }
};

export const updateModulById = async (req, res) => {
  const modulId = req.params.id;

  try {
    await prisma.modul.delete({
      where: {
        id: +modulId,
      },
    });

    return res.status(200).json({ message: "Berhasil menghapus modul" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Terjadi kesalahan saat mengambil data modul." });
  }
};

// Update Modul
export const updateModul = async (req, res) => {
  const { id } = req.params;
  const { topik, waliKelas, nuptk, tujuanPembelajaran } = req.body;

  const idInt = parseInt(id);
  if (isNaN(idInt)) {
    return res.status(400).json({ message: "ID modul tidak valid" });
  }

  try {
    const modul = await prisma.modul.update({
      where: { id: idInt },
      data: {
        topik,
        waliKelas,
        nuptk,
        tujuanPembelajaran,
      },
    });

    res.json({ message: "Modul berhasil diperbarui", data: modul });
  } catch (error) {
    console.error("Gagal update modul:", error);
    res.status(500).json({ message: "Gagal update modul" });
  }
};

// Ambil Modul berdasarkan ID
export const getModulById = async (req, res) => {
  const { id } = req.params;

  const idInt = parseInt(id);
  if (isNaN(idInt)) {
    return res.status(400).json({ message: "ID modul tidak valid" });
  }

  try {
    const modul = await prisma.modul.findUnique({
      where: { id: idInt },
    });

    if (!modul) {
      return res.status(404).json({ message: "Modul tidak ditemukan" });
    }

    res.json({ message: "Data modul ditemukan", data: modul });
  } catch (error) {
    console.error("Gagal ambil modul:", error);
    res.status(500).json({ message: "Gagal ambil modul" });
  }
};
