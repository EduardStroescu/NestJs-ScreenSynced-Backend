/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Bookmarks` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Bookmarks` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `Bookmarks` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Bookmarks` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Bookmarks` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `hash` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userName]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[displayName]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mediaId` to the `Bookmarks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaType` to the `Bookmarks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('tv', 'movie');

-- DropForeignKey
ALTER TABLE "Bookmarks" DROP CONSTRAINT "Bookmarks_userId_fkey";

-- DropIndex
DROP INDEX "Users_email_key";

-- AlterTable
ALTER TABLE "Bookmarks" DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "link",
DROP COLUMN "title",
DROP COLUMN "updatedAt",
ADD COLUMN     "mediaId" INTEGER NOT NULL,
ADD COLUMN     "mediaType" "MediaType" NOT NULL;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "hash",
DROP COLUMN "lastName",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "refresh_token" TEXT,
ADD COLUMN     "userName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_userName_key" ON "Users"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Users_displayName_key" ON "Users"("displayName");

-- AddForeignKey
ALTER TABLE "Bookmarks" ADD CONSTRAINT "Bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
