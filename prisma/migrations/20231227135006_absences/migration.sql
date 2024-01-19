-- DropForeignKey
ALTER TABLE `account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `affectation_groupe` DROP FOREIGN KEY `Affectation_groupe_CIN_fkey`;

-- DropForeignKey
ALTER TABLE `affectation_groupe` DROP FOREIGN KEY `Affectation_groupe_groupeId_fkey`;

-- DropForeignKey
ALTER TABLE `detailseance` DROP FOREIGN KEY `detailSeance_groupeId_fkey`;

-- DropForeignKey
ALTER TABLE `detailseance` DROP FOREIGN KEY `detailSeance_matiereId_fkey`;

-- DropForeignKey
ALTER TABLE `detailseance` DROP FOREIGN KEY `detailSeance_seanceId_fkey`;

-- DropForeignKey
ALTER TABLE `groupe` DROP FOREIGN KEY `Groupe_niveauId_fkey`;

-- DropForeignKey
ALTER TABLE `matiere` DROP FOREIGN KEY `Matiere_niveauId_fkey`;

-- DropForeignKey
ALTER TABLE `presence` DROP FOREIGN KEY `Presence_CIN_fkey`;

-- DropForeignKey
ALTER TABLE `presence` DROP FOREIGN KEY `Presence_seanceId_fkey`;

-- DropForeignKey
ALTER TABLE `session` DROP FOREIGN KEY `Session_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Matiere` ADD CONSTRAINT `Matiere_niveauId_fkey` FOREIGN KEY (`niveauId`) REFERENCES `Niveau`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Groupe` ADD CONSTRAINT `Groupe_niveauId_fkey` FOREIGN KEY (`niveauId`) REFERENCES `Niveau`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailSeance` ADD CONSTRAINT `detailSeance_matiereId_fkey` FOREIGN KEY (`matiereId`) REFERENCES `Matiere`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailSeance` ADD CONSTRAINT `detailSeance_seanceId_fkey` FOREIGN KEY (`seanceId`) REFERENCES `Seance`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailSeance` ADD CONSTRAINT `detailSeance_groupeId_fkey` FOREIGN KEY (`groupeId`) REFERENCES `Groupe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Affectation_groupe` ADD CONSTRAINT `Affectation_groupe_groupeId_fkey` FOREIGN KEY (`groupeId`) REFERENCES `Groupe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Affectation_groupe` ADD CONSTRAINT `Affectation_groupe_CIN_fkey` FOREIGN KEY (`CIN`) REFERENCES `Etudiant`(`CIN`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Presence` ADD CONSTRAINT `Presence_seanceId_fkey` FOREIGN KEY (`seanceId`) REFERENCES `Seance`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Presence` ADD CONSTRAINT `Presence_CIN_fkey` FOREIGN KEY (`CIN`) REFERENCES `Etudiant`(`CIN`) ON DELETE CASCADE ON UPDATE CASCADE;
