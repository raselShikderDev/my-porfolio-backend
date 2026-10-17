// Prisma configuration for datasource URL (Prisma 7+)
// The `url` property must be provided via the PrismaClient constructor.
// We expose a configuration object that can be imported wherever the client is instantiated.

export const prismaConfig = {
  datasources: {
    db: {
      // Use the same environment variable as before.
      url: process.env.DATABASE_URL,
    },
  },
};
