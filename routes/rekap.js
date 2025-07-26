import express from "express";
import { 
    getRekapMingguan,
    getRekapMingguanBySiswa,
    getLaporanMingguan
} from "../controller/rekap.js";

const router = express.Router();

router.get("/rekap/mingguan", getRekapMingguan);
router.get("/rekap/mingguan-by-siswa", getRekapMingguanBySiswa);
router.get("/rekap/mingguan-laporan", getLaporanMingguan);

export default router;
