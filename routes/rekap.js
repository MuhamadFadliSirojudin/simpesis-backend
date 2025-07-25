import express from "express";
import { 
    getRekapMingguan,
    getRekapMingguanBySiswa
} from "../controller/rekap.js";

const router = express.Router();

router.get("/rekap/mingguan", getRekapMingguan);
router.get("/rekap/mingguan-by-siswa", getRekapMingguanBySiswa);

export default router;
