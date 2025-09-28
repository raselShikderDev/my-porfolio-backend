/*
  Warnings:

  - You are about to drop the column `url` on the `Project` table. All the data in the column will be lost.
  - Added the required column `email` to the `AboutMe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `github` to the `AboutMe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linkedin` to the `AboutMe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `twitter` to the `AboutMe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `AboutMe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `githubUrl` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `liveUrl` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."AboutMe" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "github" TEXT NOT NULL,
ADD COLUMN     "linkedin" TEXT NOT NULL,
ADD COLUMN     "twitter" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Blog" ADD COLUMN     "images" TEXT[],
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "url",
ADD COLUMN     "githubUrl" TEXT NOT NULL,
ADD COLUMN     "liveUrl" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."AboutMe" ADD CONSTRAINT "AboutMe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
