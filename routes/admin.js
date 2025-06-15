// routes/admin.js
import express from "express";
import {
  loginAdmin,
  getAllAdmin,
  createAdmin,
  deleteAdminById,
  updateAdmin
} from "../controller/admin.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/", getAllAdmin);
router.post("/", createAdmin);
router.delete("/:id", deleteAdminById);
router.put("/:id", updateAdmin);

export default router;
