-- AlterTable
ALTER TABLE `Transaction` 
  CHANGE COLUMN `description` `original_description` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Transaction` 
  ADD COLUMN `description` VARCHAR(191) NULL;

