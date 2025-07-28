import express from "express";
import { 
    getRekapMingguan,
    getRekapMingguanBySiswa,
    getDetailRekapMingguanBySiswa,
    getLaporanMingguan
} from "../controller/rekap.js";

const router = express.Router();

router.get("/rekap/mingguan", getRekapMingguan);
router.get("/rekap/mingguan-by-siswa", getRekapMingguanBySiswa);
router.get("/rekap/mingguan-laporan", getLaporanMingguan);
router.get("/rekap/mingguan-detail-by-siswa", getDetailRekapMingguanBySiswa);

export default router;
