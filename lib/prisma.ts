import { PrismaClient } from "@prisma/client";

// Reuse the same Prisma Client across hot reloads / serverless invocations
// instead of creating a new one on every request.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
