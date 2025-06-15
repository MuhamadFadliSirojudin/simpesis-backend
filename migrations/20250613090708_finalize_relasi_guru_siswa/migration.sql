/*
  Warnings:

  - Made the column `guruId` on table `siswa` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_siswa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "kelompok" TEXT NOT NULL,
    "guruId" INTEGER NOT NULL,
    CONSTRAINT "siswa_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "guru" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_siswa" ("guruId", "id", "kelompok", "nama", "semester") SELECT "guruId", "id", "kelompok", "nama", "semester" FROM "siswa";
DROP TABLE "siswa";
ALTER TABLE "new_siswa" RENAME TO "siswa";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
