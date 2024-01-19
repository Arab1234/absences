/*
  Warnings:

  - You are about to drop the column `au` on the `certificat` table. All the data in the column will be lost.
  - You are about to drop the column `dateBO` on the `certificat` table. All the data in the column will be lost.
  - You are about to drop the column `dateCert` on the `certificat` table. All the data in the column will be lost.
  - You are about to drop the column `du` on the `certificat` table. All the data in the column will be lost.
  - Added the required column `dtBO` to the `Certificat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dtCert` to the `Certificat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dtConsult` to the `Certificat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nbJour` to the `Certificat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `certificat` DROP COLUMN `au`,
    DROP COLUMN `dateBO`,
    DROP COLUMN `dateCert`,
    DROP COLUMN `du`,
    ADD COLUMN `dtBO` DATE NOT NULL,
    ADD COLUMN `dtCert` DATE NOT NULL,
    ADD COLUMN `dtConsult` DATE NOT NULL,
    ADD COLUMN `nbJour` INTEGER NOT NULL;
