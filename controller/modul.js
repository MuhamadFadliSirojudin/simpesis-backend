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
