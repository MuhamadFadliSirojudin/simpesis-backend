import express from "express";
import {
  createModul,
  getAllModul,
  updateModulById,
  deleteModulById,
  updateModul,
  getModulById,
} from "../controller/modul.js";

const router = express.Router();

router.post("/", createModul);

router.get("/", getAllModul);

router.delete("/:id", deleteModulById);

router.patch("/:id", updateModulById);

router.put("/:id", updateModul);

router.get("/:id", getModulById)

export default router;
