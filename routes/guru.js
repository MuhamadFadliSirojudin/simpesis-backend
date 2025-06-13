import express from "express";
import {
  createGuru,
  getAllGuru,
  deleteGuruById,
  getGuruKinerja
} from "../controller/guru.js";

const router = express.Router();

router.post("/", createGuru);
router.get("/", getAllGuru);
router.delete("/:id", deleteGuruById);
router.get("/kinerja", getGuruKinerja);

export default router;
