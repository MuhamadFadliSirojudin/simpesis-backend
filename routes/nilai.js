import express from "express";
import {
  createNewNilai,
  deleteNilai,
  getAllNilaiBySiswaId,
  updateNilaiById,
  deleteNilaiById
} from "../controller/nilai.js";

const router = express.Router();

router.post("/", createNewNilai);

router.delete("/", deleteNilai);

router.get("/:siswaId", getAllNilaiBySiswaId);

router.put("/:id", updateNilaiById);

router.delete("/:id", deleteNilaiById);

export default router;
