import express from "express";
import { createSiswa, deleteSiswa, getAllSiswa } from "../controller/siswa.js";

const router = express.Router();

router.post("/", createSiswa);

router.get("/", getAllSiswa);

router.delete("/:siswaId", deleteSiswa);

export default router;
