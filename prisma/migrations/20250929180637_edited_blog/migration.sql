/*
  Warnings:

  - You are about to drop the `AboutMe` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `github` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linkedin` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `twitter` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."AboutMe" DROP CONSTRAINT "AboutMe_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Blog" ADD COLUMN     "publishedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "address" VARCHAR(150) NOT NULL,
ADD COLUMN     "github" TEXT NOT NULL,
ADD COLUMN     "linkedin" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone" INTEGER NOT NULL,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "twitter" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."AboutMe";
