import express from "express";
import {
  createNewNilai,
  deleteNilai,
  getAllNilaiBySiswaId,
  getRekapMingguanBySiswa
} from "../controller/nilai.js";

const router = express.Router();

router.post("/", createNewNilai);

router.delete("/", deleteNilai);

router.get("/:siswaId", getAllNilaiBySiswaId);

router.get("/rekap-mingguan/:siswaId", getRekapMingguanBySiswa);

export default router;
