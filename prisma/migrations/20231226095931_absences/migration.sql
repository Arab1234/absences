/*
  Warnings:

  - You are about to drop the column `filiereId` on the `etudiant` table. All the data in the column will be lost.
  - You are about to drop the `filiere` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `filiere` to the `Etudiant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `etudiant` DROP FOREIGN KEY `Etudiant_filiereId_fkey`;

-- DropForeignKey
ALTER TABLE `filiere` DROP FOREIGN KEY `Filiere_niveauId_fkey`;

-- AlterTable
ALTER TABLE `etudiant` DROP COLUMN `filiereId`,
    ADD COLUMN `filiere` VARCHAR(191) NOT NULL,
    MODIFY `CNE` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `filiere`;
