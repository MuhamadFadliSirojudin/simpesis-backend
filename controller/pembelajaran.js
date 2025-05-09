import prisma from "../lib/db.js";

export const createPembelajaran = async (req, res) => {
  const data = req.body;

  try {
    const newPembelajaran = await prisma.pembelajaran.create({
      data,
    });

    res.status(200).json({
      message: "berhasil menambah pembelajaran",
      data: newPembelajaran,
    });
  } catch (error) {
    console.error("Error saat get modul:", error);
    return res
      .status(500)
      .json({ error: "Terjadi kesalahan saat mengambil data modul." });
  }
};

export const deletePembelajaranById = async (req, res) => {
  const pembelajaranId = req.params.id;

  try {
    await prisma.pembelajaran.delete({
      where: {
        id: +pembelajaranId,
      },
    });

    return res
      .status(200)
      .json({ message: "Berhasil menghapus data pembelajaran" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Terjadi kesalahan saat menghapus data pembelajaran." });
  }
};

export const getPembelajaranByModulId = async (req, res) => {
  const modulId = req.params.id;

  const pembelajarans = await prisma.pembelajaran.findMany({
    where: {
      modul_id: +modulId,
    },
  });

  res.status(200).json({
    data: pembelajarans,
  });
};
