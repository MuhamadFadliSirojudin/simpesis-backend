import express from "express";
import multer from "multer";
import prisma from "../lib/db.js";

const router = express.Router();

// Gunakan memory storage karena akan disimpan ke database
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Simpan file ke database (tabel Upload)
    const saved = await prisma.upload.create({
      data: {
        filename: file.originalname,
        mimetype: file.mimetype,
        data: file.buffer,
      },
    });

    res.status(200).json({ message: "Upload successful", fileId: saved.id });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed." });
  }
});

export default router;
