import express from "express";
import cors from "cors";

const app = express();

// ✅ Aktifkan CORS manual
app.use(cors({
  origin: "https://simpesis-tklabschool-upi.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Tambahkan handler OPTIONS (preflight)
app.options("*", cors());

// Middleware dasar
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

// Import route
import authRouter from "./routes/auth.js";
import siswaRouter from "./routes/siswa.js";
import modulRouter from "./routes/modul.js";
import pembelajaranRouter from "./routes/pembelajaran.js";
import nilaiRouter from "./routes/nilai.js";
import uploadRouter from "./routes/upload.js";
import laporanRouter from "./routes/laporan.js";
import guruRouter from "./routes/guru.js";

// Route mapping
app.use("/api/auth", authRouter);
app.use("/api/siswa", siswaRouter);
app.use("/api/modul", modulRouter);
app.use("/api/pembelajaran", pembelajaranRouter);
app.use("/api/nilai", nilaiRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/laporan", laporanRouter);
app.use("/api/guru", guruRouter);

// Error handler
app.use((err, req, res, next) => {
  if (err?.name === "UnauthorizedError") {
    return res.status(401).json({ status: "error", message: "missing authorization credentials" });
  } else if (err?.errorCode) {
    return res.status(err.errorCode).json(err.message);
  } else if (err) {
    return res.status(500).json(err.message);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
