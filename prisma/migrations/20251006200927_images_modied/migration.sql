/*
  Warnings:

  - Made the column `avater` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Blog" ALTER COLUMN "images" SET DEFAULT ARRAY['https://placehold.co/800x450/eee/555?font=playfair-display&text=No+Thumbnail+Yet']::TEXT[];

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "avater" SET NOT NULL,
ALTER COLUMN "avater" SET DEFAULT 'https://cdn-icons-png.flaticon.com/512/9385/9385289.png';
