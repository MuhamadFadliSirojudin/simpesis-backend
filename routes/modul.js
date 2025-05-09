import express from "express";
import {
  createModul,
  getAllModul,
  updateModulById,
  deleteModulById,
} from "../controller/modul.js";

const router = express.Router();

router.post("/", createModul);

router.get("/", getAllModul);

router.delete("/:id", deleteModulById);

router.patch("/:id", updateModulById);

export default router;
