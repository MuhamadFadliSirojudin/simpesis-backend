-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_guru" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'guru',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_guru" ("created_at", "id", "password", "username") SELECT "created_at", "id", "password", "username" FROM "guru";
DROP TABLE "guru";
ALTER TABLE "new_guru" RENAME TO "guru";
CREATE UNIQUE INDEX "guru_username_key" ON "guru"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
