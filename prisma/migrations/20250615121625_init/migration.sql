-- CreateTable
CREATE TABLE "guru" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nuptk" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'guru',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "siswa" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "kelompok" TEXT NOT NULL,
    "guruId" INTEGER NOT NULL,

    CONSTRAINT "siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modul" (
    "id" SERIAL NOT NULL,
    "penyusun" TEXT NOT NULL,
    "topik" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "tujuan" TEXT NOT NULL,

    CONSTRAINT "modul_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pembelajaran" (
    "id" SERIAL NOT NULL,
    "modul_id" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "pembelajaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nilai" (
    "id" SERIAL NOT NULL,
    "id_pembelajaran" INTEGER NOT NULL,
    "id_siswa" INTEGER NOT NULL,
    "id_modul" INTEGER NOT NULL,
    "foto_karya" BYTEA NOT NULL,
    "nilai" INTEGER NOT NULL,

    CONSTRAINT "nilai_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upload" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Upload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guru_username_key" ON "guru"("username");

-- AddForeignKey
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pembelajaran" ADD CONSTRAINT "pembelajaran_modul_id_fkey" FOREIGN KEY ("modul_id") REFERENCES "modul"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai" ADD CONSTRAINT "nilai_id_pembelajaran_fkey" FOREIGN KEY ("id_pembelajaran") REFERENCES "pembelajaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai" ADD CONSTRAINT "nilai_id_modul_fkey" FOREIGN KEY ("id_modul") REFERENCES "modul"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai" ADD CONSTRAINT "nilai_id_siswa_fkey" FOREIGN KEY ("id_siswa") REFERENCES "siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
