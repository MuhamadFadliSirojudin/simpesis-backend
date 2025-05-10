import express from "express";
import prisma from "../lib/db.js";

const router = express.Router();

// DELETE laporan by ID
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.laporan.delete({
      where: { id },
    });
    res.status(200).json({ message: "Laporan berhasil dihapus" });
  } catch (error) {
    console.error("Gagal hapus laporan:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus laporan" });
  }
});

export default router;
