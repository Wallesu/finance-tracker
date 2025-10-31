-- AlterTable: Renomear original_description para originalDescription (camelCase)
ALTER TABLE `Transaction` 
  CHANGE COLUMN `original_description` `originalDescription` VARCHAR(191) NOT NULL;

