import express from "express";
import {
  createPembelajaran,
  getPembelajaranByModulId,
  deletePembelajaranById,
} from "../controller/pembelajaran.js";

const router = express.Router();

router.post("/", createPembelajaran);

router.get("/:id", getPembelajaranByModulId);

router.delete("/:id", deletePembelajaranById);

export default router;
