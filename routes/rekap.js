import express from "express";
import {
    getRekapHarian,
    getRekapHarianBySiswa,
    getDetailRekapHarianBySiswa,
    getLaporanHarian, 
    getRekapMingguan,
    getRekapMingguanBySiswa,
    getDetailRekapMingguanBySiswa,
    getLaporanMingguan,
    getRekapBulanan,
    getRekapBulananBySiswa,
    getDetailRekapBulananBySiswa,
    getLaporanBulanan,
    getRekapSemester,
    getRekapSemesterBySiswa,
    getDetailRekapSemesterBySiswa,
    getLaporanSemester
} from "../controller/rekap.js";

const router = express.Router();

router.get("/rekap/harian", getRekapHarian);
router.get("/rekap/harian-by-siswa", getRekapHarianBySiswa);
router.get("/rekap/harian-detail-by-siswa", getDetailRekapHarianBySiswa);
router.get("/rekap/harian-laporan", getLaporanHarian);
router.get("/rekap/mingguan", getRekapMingguan);
router.get("/rekap/mingguan-by-siswa", getRekapMingguanBySiswa);
router.get("/rekap/mingguan-detail-by-siswa", getDetailRekapMingguanBySiswa);
router.get("/rekap/mingguan-laporan", getLaporanMingguan);
router.get("/rekap/bulanan", getRekapBulanan);
router.get("/rekap/bulanan-by-siswa", getRekapBulananBySiswa);
router.get("/rekap/bulanan-detail-by-siswa", getDetailRekapBulananBySiswa);
router.get("/rekap/bulanan-laporan", getLaporanBulanan);
router.get("/rekap/semester", getRekapSemester);
router.get("/rekap/semester-by-siswa", getRekapSemesterBySiswa);
router.get("/rekap/semester-detail-by-siswa", getDetailRekapSemesterBySiswa);
router.get("/rekap/semester-laporan", getLaporanSemester);

export default router;
