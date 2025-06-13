import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import siswaRouter from "./routes/siswa.js";
import modulRouter from "./routes/modul.js";
import pembelajaranRouter from "./routes/pembelajaran.js";
import nilaiRouter from "./routes/nilai.js";
import uploadRouter from "./routes/upload.js";
import laporanRouter from "./routes/laporan.js";
import guruRouter from "./routes/guru.js";

const app = express();

// ✅ CORS config harus di atas semua
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://simpesis-tklabschool-upi.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.options("*", cors());

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

// Route
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
    return res.status(401).json({
      status: "error",
      message: "missing authorization credentials",
    });
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
