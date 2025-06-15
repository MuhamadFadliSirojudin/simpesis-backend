import jwt from "jsonwebtoken";
import prisma from "../lib/db.js";

// REGISTER – hanya untuk GURU
export const register = async (req, res) => {
  const { nama, username, password, nuptk } = req.body;

  // Validasi field wajib
  if (!nama || !username || !password || !nuptk) {
    return res.status(400).json({ message: "Nama, Username, Password, dan NUPTK wajib diisi." });
  }

  try {
    const isExist = await prisma.guru.findUnique({ where: { username } });
    if (isExist) {
      return res.status(409).json({ error: "Username sudah terdaftar sebagai guru." });
    }

    await prisma.guru.create({
      data: {
        nama,
        username,
        password,
        nuptk,
        role: "guru", // default
      },
    });

    return res.status(201).json({ message: "Akun guru berhasil dibuat." });
  } catch (err) {
    console.error("Error saat register:", err);
    return res.status(500).json({ error: "Terjadi kesalahan saat membuat akun." });
  }
};

// LOGIN – bisa untuk ADMIN atau GURU
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Cek ke tabel admin lebih dulu
    const admin = await prisma.admin.findUnique({ where: { username } });

    if (admin) {
      if (admin.password !== password) {
        return res.status(400).json({ message: "Password tidak sesuai." });
      }

      const token = "Bearer " + jwt.sign({ id: admin.id }, "LabschoolUPI", {
        expiresIn: 60 * 60 * 24,
      });

      return res.status(200).json({
        id: admin.id,
        username: admin.username,
        role: "admin",
        accessToken: token,
      });
    }

    // Jika bukan admin → cek ke tabel guru
    const guru = await prisma.guru.findUnique({ where: { username } });

    if (!guru) {
      return res.status(404).json({
        message: `Akun dengan username: ${username} tidak ditemukan`,
      });
    }

    if (guru.password !== password) {
      return res.status(400).json({ message: "Password tidak sesuai." });
    }

    const token = "Bearer " + jwt.sign({ id: guru.id }, "LabschoolUPI", {
      expiresIn: 60 * 60 * 24,
    });

    return res.status(200).json({
      id: guru.id,
      username: guru.username,
      role: guru.role,
      accessToken: token,
    });
  } catch (err) {
    console.error("Error saat login:", err);
    return res.status(500).json({ error: "Terjadi kesalahan saat login." });
  }
};
