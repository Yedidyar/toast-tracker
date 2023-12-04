import { PrismaClient } from "@prisma/client";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

import { env } from "../env/server.mjs";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const poolConnection = mysql.createPool({
  host: env.DATABASE_HOST,
  user: env.DATABASE_USERNAME,
  database: env.DATABASE,
  password: env.DATABASE_PASSWORD,
});

export const db = drizzle(poolConnection);
