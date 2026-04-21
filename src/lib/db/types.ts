import { Prisma, PrismaClient } from "@/generated/prisma/client";

export type DB = PrismaClient | Prisma.TransactionClient;

export const WITH_DELETED = Symbol("withDeleted");
