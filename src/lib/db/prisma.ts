import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { env } from "../config/env.config";
import { WITH_DELETED } from "./types";
import {
  LogDefinition,
  LogLevel,
} from "@/generated/prisma/internal/prismaNamespace";

const connectionString = `${env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const logQueries = process.env.NODE_ENV === "development";
const log: (LogLevel | LogDefinition)[] = logQueries
  ? [
      { level: "query", emit: "event" },
      { level: "query", emit: "stdout" },
      { level: "error", emit: "stdout" },
      { level: "warn", emit: "stdout" },
    ]
  : [{ level: "error", emit: "stdout" }];

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter, log }).$extends({
    query: {
      $allModels: {
        async count({ args, query }) {
          const includeDeleted = (args as any)[WITH_DELETED];

          if (!includeDeleted) {
            if (!("deletedAt" in (args.where ?? {}))) {
              args.where = {
                ...args.where,
                deletedAt: null,
              };
            }
          }

          delete (args as any)[WITH_DELETED];

          return query(args);
        },
        async findMany({ args, query }) {
          const includeDeleted = (args as any)[WITH_DELETED];

          if (!includeDeleted) {
            if (!("deletedAt" in (args.where ?? {}))) {
              args.where = {
                ...args.where,
                deletedAt: null,
              };
            }
          }

          delete (args as any)[WITH_DELETED];

          return query(args);
        },
        async findFirst({ args, query }) {
          const includeDeleted = (args as any)[WITH_DELETED];

          if (!includeDeleted) {
            if (!("deletedAt" in (args.where ?? {}))) {
              args.where = {
                ...args.where,
                deletedAt: null,
              };
            }
          }

          delete (args as any)[WITH_DELETED];

          return query(args);
        },
        async findUnique({ args, query, model }) {
          const includeDeleted = (args as any)[WITH_DELETED];

          if (!includeDeleted) {
            if (!("deletedAt" in (args.where ?? {}))) {
              args.where = {
                ...args.where,
                deletedAt: new Date(),
              };
            }
          }

          delete (args as any)[WITH_DELETED];

          // return (this as any).findFirst(args);
          return query(args);
        },
      },
    },
    model: {
      $allModels: {
        async findManyWithDeleted(this: any, args: any) {
          return this.findMany(args);
        },
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
