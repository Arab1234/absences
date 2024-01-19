/*
  Warnings:

  - Added the required column `est_valide` to the `Certificat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `certificat` ADD COLUMN `est_valide` BOOLEAN NOT NULL;
