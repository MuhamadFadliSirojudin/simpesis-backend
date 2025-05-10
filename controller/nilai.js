import prisma from "../lib/db.js";

export const createNewNilai = async (req, res) => {
  try {
    const { data } = req.body;
    const { id_pembelajaran, id_siswa, id_modul } = data[0];

    const nilaiExist = await prisma.nilai.findMany({
      where: {
        id_modul,
        id_siswa,
        id_pembelajaran,
      },
    });

    if (nilaiExist.length !== 0)
      return res
        .status(409)
        .json({ message: "data siswa dengan modul tersebut sudah ada" });

    const processed = data.map((item) => {
      const base64String = item.foto_karya.replace(/^data:.*?;base64,/, "");
      const buffer = Buffer.from(base64String, "base64");

      return {
        ...item,
        foto_karya: buffer,
      };
    });

    const newData = await prisma.nilai.createMany({ data: processed });

    return res.status(201).json({
      message: `Berhasil menambah ${newData.count} data`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Gagal menambah data" });
  }
};

export const getAllNilaiBySiswaId = async (req, res) => {
  const siswaId = +req.params.siswaId;
  const modulId = +req.query.modulId;

  try {
    const nilais = await prisma.nilai.findMany({
      where: {
        id_siswa: siswaId,
        ...(modulId && { id_modul: modulId }),
      },
      include: {
        modul: true,
        siswa: true,
        pembelajaran: true,
      },
    });

    const processed = nilais.map((item) => {
      let dataUri = null;

      if (item.foto_karya) {
        const buffer = Buffer.isBuffer(item.foto_karya)
          ? item.foto_karya
          : Buffer.from(item.foto_karya);

        const base64Foto = buffer.toString("base64");
        dataUri = `data:image/jpeg;base64,${base64Foto}`;
      }

      return {
        ...item,
        foto_karya: dataUri,
      };
    });

    return res.status(200).json({
      data: processed,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Terjadi kesalahan saat mengambil data modul." });
  }
};

export const deleteNilai = async (req, res) => {
  const { siswaId, modulId } = req.query;

  if (!siswaId || !modulId) {
    return res
      .status(400)
      .json({ message: "Parameter siswaId dan modulId diperlukan." });
  }

  try {
    const result = await prisma.nilai.deleteMany({
      where: {
        id_siswa: +siswaId,
        id_modul: +modulId,
      },
    });

    if (result.count === 0) {
      return res
        .status(404)
        .json({ message: "Data nilai tidak ditemukan atau sudah dihapus." });
    }

    return res.status(200).json({
      message: "Berhasil menghapus laporan nilai",
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Gagal menghapus nilai:", error);
    return res.status(500).json({
      error: "Terjadi kesalahan saat menghapus laporan nilai.",
    });
  }
};
