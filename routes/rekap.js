import express from "express";
import { getRekapMingguan } from "../controllers/rekap.js";

const router = express.Router();

router.get("/rekap/mingguan", getRekapMingguan);

export default router;
