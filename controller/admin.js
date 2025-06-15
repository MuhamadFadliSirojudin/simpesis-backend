import prisma from "../lib/db.js";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    const token = 'Bearer ' + jwt.sign(
      { id: admin.id, role: "admin" },
      'LabschoolUPI',
      { expiresIn: 60 * 60 * 24 }
    );

    res.status(200).json({
      id: admin.id,
      username: admin.username,
      role: "admin",
      accessToken: token
    });
  } catch (err) {
    console.log("Login Admin Gagal:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat login admin" });
  }
};
