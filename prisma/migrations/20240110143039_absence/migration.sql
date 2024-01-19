-- DropForeignKey
ALTER TABLE `presence` DROP FOREIGN KEY `Presence_seanceId_fkey`;

-- AddForeignKey
ALTER TABLE `Presence` ADD CONSTRAINT `Presence_seanceId_fkey` FOREIGN KEY (`seanceId`) REFERENCES `detailSeance`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
