import jwt from "jsonwebtoken";
import prisma from "../lib/db.js";

export const register = async (req, res) => {
  const { nama, username, password, role = "guru" } = req.body;

  // Validasi field wajib
  if (!nama || !username || !password) {
    return res.status(400).json({ message: "Nama, username, dan password wajib diisi" });
  }

  try {
    // Cek apakah username sudah digunakan
    const isExist = await prisma.guru.findUnique({
      where: { username },
    });

    if (isExist) {
      return res.status(409).json({ error: "Username sudah terdaftar" });
    }

    // Simpan akun baru
    const newUser = await prisma.guru.create({
      data: {
        nama,
        username,
        password,
        role, // default: "guru"
      },
    });

    return res.status(201).json({ message: "Akun berhasil dibuat" });
  } catch (err) {
    console.error("Error saat register:", err);
    return res.status(500).json({ error: "Terjadi kesalahan saat membuat akun" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.guru.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ message: `Akun dengan username: ${username} tidak ditemukan` });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Password tidak sesuai" });
    }

    const token = 'Bearer ' + jwt.sign({ id: user.id }, 'LabschoolUPI', {
      expiresIn: 60 * 60 * 24,
    });

    return res.status(200).json({
      id: user.id,
      username: user.username,
      role: user.role,
      accessToken: token,
    });
  } catch (err) {
    console.error("Error saat login:", err);
    return res.status(500).json({ error: "Terjadi kesalahan saat login" });
  }
};
