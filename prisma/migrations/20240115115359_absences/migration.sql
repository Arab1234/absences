/*
  Warnings:

  - Added the required column `dateBO` to the `Certificat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateCert` to the `Certificat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `certificat` ADD COLUMN `dateBO` DATE NOT NULL,
    ADD COLUMN `dateCert` DATE NOT NULL;
