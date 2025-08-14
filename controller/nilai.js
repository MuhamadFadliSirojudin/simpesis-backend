import prisma from "../lib/db.js";

export const createNewNilai = async (req, res) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "Data nilai kosong" });
    }

    let insertedCount = 0;
    let skippedCount = 0;

    for (const item of data) {
      const { id_pembelajaran, id_siswa, id_modul, nilai, foto_karya } = item;

      const existing = await prisma.nilai.findFirst({
        where: {
          id_modul,
          id_siswa,
          id_pembelajaran,
        },
      });

      if (existing) {
        skippedCount++;
        continue;
      }

      let bufferFoto = null;
      if (foto_karya && foto_karya.startsWith("data:")) {
        const base64String = foto_karya.replace(/^data:.*?;base64,/, "");
        bufferFoto = Buffer.from(base64String, "base64");
      }

      await prisma.nilai.create({
        data: {
          id_pembelajaran,
          id_siswa,
          id_modul,
          nilai,
          foto_karya: bufferFoto,
        },
      });
      insertedCount++;
    }

    return res.status(201).json({
      message: `Berhasil menambah ${insertedCount} kegiatan baru, ${skippedCount} kegiatan dilewati karena sudah ada`,
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

export const updateNilaiById = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nilai } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID nilai tidak valid" });
  }

  try {
    const updated = await prisma.nilai.update({
      where: { id },
      data: { nilai },
    });

    return res.status(200).json({
      message: "Nilai berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    console.error("Gagal update nilai:", error);
    return res.status(500).json({ message: "Gagal update nilai" });
  }
};

// Hapus nilai per ID
export const deleteNilaiById = async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID nilai tidak valid" });
  }

  try {
    await prisma.nilai.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Nilai berhasil dihapus" });
  } catch (error) {
    console.error("Gagal hapus nilai:", error);
    return res.status(500).json({ message: "Gagal hapus nilai" });
  }
};
