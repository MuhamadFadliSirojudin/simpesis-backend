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

export const createAdmin = async (req, res) => {
  const { nama, username, password, nuptk } = req.body;

  try {
    const exist = await prisma.admin.findUnique({ where: { username } });
    if (exist) {
      return res.status(409).json({ message: "Username sudah digunakan" });
    }

    const admin = await prisma.admin.create({
      data: {
        nama,
        username,
        password,
        nuptk,
        role: "admin"
      }
    });

    res.status(201).json(admin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menambahkan admin" });
  }
};

export const getAllAdmin = async (req, res) => {
  try {
    const result = await prisma.admin.findMany();
    res.json({ data: result });
  } catch (error) {
    console.error("❌ Error getAllAdmin:", error);
    res.status(500).json({ message: "Gagal mengambil data admin" });
  }
};

export const deleteAdminById = async (req, res) => {
  const id = +req.params.id;
  try {
    await prisma.admin.delete({ where: { id } });
    res.json({ message: "Admin dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus admin" });
  }
};

export const updateAdmin = async (req, res) => {
  const id = +req.params.id;
  const { nama, username, nuptk, password } = req.body;

  try {
    const updated = await prisma.admin.update({
      where: { id },
      data: {
        nama,
        username,
        nuptk,
        ...(password && { password }), // hanya update jika ada
      },
    });

    res.json({ message: "Admin berhasil diperbarui", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui admin" });
  }
};