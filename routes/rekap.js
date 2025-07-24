import express from "express";
import { getRekapMingguan } from "../controllers/rekap";

const router = express.Router();

router.get("/rekap/mingguan", getRekapMingguan);

export default router;
