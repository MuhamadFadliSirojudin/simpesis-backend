import express from "express";
import { createSiswa, deleteSiswa, getAllSiswa, getSiswaById, updateSiswa } from "../controller/siswa.js";

const router = express.Router();

router.post("/", createSiswa);

router.get("/", getAllSiswa);

router.delete("/:siswaId", deleteSiswa);

router.get("/:siswaId", getSiswaById);

router.put("/:siswaId", updateSiswa);


export default router;
