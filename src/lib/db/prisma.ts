import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../../generated/prisma/client";
import { env } from "../config/env.config";

const connectionString = `${env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const log: ("error" | "query" | "warn")[] = ["error"];
if (process.env.NODE_ENV !== "development") log.push("warn", "query");

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ adapter, log });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type DB = PrismaClient | Prisma.TransactionClient;
