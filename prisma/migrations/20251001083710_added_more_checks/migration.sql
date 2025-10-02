-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('MANAGER', 'OWNER');

-- CreateEnum
CREATE TYPE "public"."IsActive" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "isActive" "public"."IsActive" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'OWNER';
