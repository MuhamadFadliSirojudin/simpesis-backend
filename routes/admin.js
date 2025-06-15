// routes/admin.js
import express from "express";
import { loginAdmin } from "../controller/admin.js";

const router = express.Router();

router.post("/login", loginAdmin);

export default router;
