import express from "express";
import { 
    getRekapMingguan,
    getRekapMingguanBySiswa,
    getDetailRekapMingguanBySiswa,
    getLaporanMingguan,
    getRekapBulanan,
    getRekapBulananBySiswa,
    getDetailRekapBulananBySiswa,
    getLaporanBulanan
} from "../controller/rekap.js";

const router = express.Router();

router.get("/rekap/mingguan", getRekapMingguan);
router.get("/rekap/mingguan-by-siswa", getRekapMingguanBySiswa);
router.get("/rekap/mingguan-detail-by-siswa", getDetailRekapMingguanBySiswa);
router.get("/rekap/mingguan-laporan", getLaporanMingguan);
router.get("/rekap/bulanan", getRekapBulanan);
router.get("/rekap/bulanan-by-siswa", getRekapBulananBySiswa);
router.get("/rekap/bulanan-detail-by-siswa", getDetailRekapBulananBySiswa);
router.get("/rekap/bulanan-laporan", getLaporanBulanan);

export default router;
