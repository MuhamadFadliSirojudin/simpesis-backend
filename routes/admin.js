// routes/admin.js
import express from "express";
import { loginAdmin } from "../controller/admin.js";
import { getAllAdmin, createAdmin } from "../controller/admin.js";
const router = express.Router();

router.post("/login", loginAdmin);
router.get("/", getAllAdmin);
router.post("/", createAdmin);

export default router;
