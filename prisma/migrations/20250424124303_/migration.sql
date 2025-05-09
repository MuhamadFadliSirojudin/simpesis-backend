-- CreateTable
CREATE TABLE "guru" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "siswa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "kelompok" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "modul" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "penyusun" TEXT NOT NULL,
    "topik" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "tujuan" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "pembelajaran" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "modul_id" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    CONSTRAINT "pembelajaran_modul_id_fkey" FOREIGN KEY ("modul_id") REFERENCES "modul" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "nilai" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_pembelajaran" INTEGER NOT NULL,
    "id_siswa" INTEGER NOT NULL,
    "id_modul" INTEGER NOT NULL,
    "foto_karya" BLOB NOT NULL,
    "nilai" INTEGER NOT NULL,
    CONSTRAINT "nilai_id_pembelajaran_fkey" FOREIGN KEY ("id_pembelajaran") REFERENCES "pembelajaran" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "nilai_id_modul_fkey" FOREIGN KEY ("id_modul") REFERENCES "modul" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "nilai_id_siswa_fkey" FOREIGN KEY ("id_siswa") REFERENCES "siswa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "guru_username_key" ON "guru"("username");
