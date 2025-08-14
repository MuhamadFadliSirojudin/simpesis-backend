import express from "express";
import {
  createNewNilai,
  deleteNilai,
  getAllNilaiBySiswaId,
  updateNilaiById,
  deleteNilaiById,
  getNilaiBySiswa
} from "../controller/nilai.js";

const router = express.Router();

router.post("/", createNewNilai);

router.delete("/", deleteNilai);

router.get("/:siswaId", getAllNilaiBySiswaId);

router.put("/:id", updateNilaiById);

router.delete("/:id", deleteNilaiById);

router.get("/by-siswa/:siswaId", getNilaiBySiswa);

export default router;
