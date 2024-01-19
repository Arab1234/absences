-- AlterTable
ALTER TABLE `session` MODIFY `accessToken` VARCHAR(191) NULL,
    MODIFY `csrfToken` VARCHAR(191) NULL;
