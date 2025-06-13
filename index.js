import express from "express";
import * as bodyParser from "body-parser";
import authRouter from "./routes/auth.js";
import siswaRouter from "./routes/siswa.js";
import modulRouter from "./routes/modul.js";
import pembelajaranRouter from "./routes/pembelajaran.js";
import nilaiRouter from "./routes/nilai.js";
import uploadRouter from "./routes/upload.js";
import laporanRouter from "./routes/laporan.js";
import cors from "cors";
import guruRouter from "./routes/guru.js";
app.use("/api/guru", guruRouter);

const app = express();

app.use(cors());

origin: "https://simpesis-tklabschool-upi.vercel.app", // untuk sementara izinkan semua asal, bisa dibatasi nanti
  methods ["GET", "POST", "DELETE", "PUT", "PATCH"],
  allowedHeaders ["Content-Type", "Authorization"];

const PORT = 3000;

app.use("/api/auth", authRouter);

app.use("/api/siswa", siswaRouter);

app.use("/api/modul", modulRouter);

app.use("/api/pembelajaran", pembelajaranRouter);

app.use("/api/nilai", nilaiRouter);

app.use("/api/upload", uploadRouter);

app.use("/api/laporan", laporanRouter);

app.use((err, req, res, next) => {
  if (err && err.name === "UnauthorizedError") {
    return res.status(401).json({
      status: "error",
      message: "missing authorization credentials",
    });
  } else if (err && err.errorCode) {
    res.status(err.errorCode).json(err.message);
  } else if (err) {
    res.status(500).json(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
