/*
  Warnings:

  - Made the column `group_name` on table `conversations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "conversations" ALTER COLUMN "group_name" SET NOT NULL;
