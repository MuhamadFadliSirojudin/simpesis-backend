import express from "express";
import {
  createNewNilai,
  deleteNilai,
  getAllNilaiBySiswaId,
} from "../controller/nilai.js";

const router = express.Router();

router.post("/", createNewNilai);

router.delete("/", deleteNilai);

router.get("/:siswaId", getAllNilaiBySiswaId);

export default router;
