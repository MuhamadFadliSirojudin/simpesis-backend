import express from "express";
import {
  createGuru,
  getAllGuru,
  deleteGuruById,
  getGuruKinerja,
  updateGuru,
  getDaftarGuru
} from "../controller/guru.js";

const router = express.Router();

router.post("/", createGuru);
router.get("/", getAllGuru);
router.delete("/:id", deleteGuruById);
router.get("/kinerja", getGuruKinerja);
router.put("/:id", updateGuru);
router.get("/daftar", getDaftarGuru);

export default router;
