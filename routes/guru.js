import express from "express";
import {
  createGuru,
  getAllGuru,
  deleteGuruById,
  getGuruKinerja,
  updateGuru
} from "../controller/guru.js";

const router = express.Router();

router.post("/", createGuru);
router.get("/", getAllGuru);
router.delete("/:id", deleteGuruById);
router.get("/kinerja", getGuruKinerja);
router.put("/:id", updateGuru);

export default router;
