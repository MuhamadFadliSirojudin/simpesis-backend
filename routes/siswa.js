import express from "express";
import { createSiswa, deleteSiswa, getAllSiswa, getSiswaById } from "../controller/siswa.js";

const router = express.Router();

router.post("/", createSiswa);

router.get("/", getAllSiswa);

router.delete("/:siswaId", deleteSiswa);

router.get("/:siswaId", getSiswaById);

export default router;
