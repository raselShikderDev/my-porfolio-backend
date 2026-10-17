import { PrismaClient } from "@prisma/client"
import { prismaConfig } from "./prisma.config"

// Initialize PrismaClient with datasource configuration moved to prisma.config.ts
export const prisma = new PrismaClient(prismaConfig)