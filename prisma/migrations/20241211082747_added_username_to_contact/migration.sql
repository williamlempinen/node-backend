/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `contacts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "username" VARCHAR(54);

-- CreateIndex
CREATE UNIQUE INDEX "contacts_username_key" ON "contacts"("username");
