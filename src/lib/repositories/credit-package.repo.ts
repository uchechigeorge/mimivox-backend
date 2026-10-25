import { CreditPackage, Prisma } from "@/generated/prisma/client";
import {
  CreditPackageCreateArgs,
  CreditPackageUpdateArgs,
} from "@/generated/prisma/models";
import { prisma } from "../db/prisma";
import { DB } from "../db/types";

const getById = async (
  id: CreditPackage["id"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.creditPackage.findFirst({
    where: { id, deletedAt: null },
  });
};

const list = async (
  type?: CreditPackage["type"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.creditPackage.findMany({
    where: { ...(type && { type }), deletedAt: null },
    orderBy: [{ type: "asc" }, { sequence: "asc" }],
  });
};

const getBySlug = async (slug: string, tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  // Includes deleted packages because the slug stays unique
  return await db.creditPackage.findFirst({ where: { slug } });
};

const create = async (
  data: CreditPackageCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.creditPackage.create({ data });
};

const update = async (
  id: CreditPackage["id"],
  data: CreditPackageUpdateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.creditPackage.update({ where: { id }, data });
};

const upsertBySlug = async (
  data: CreditPackageCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.creditPackage.upsert({
    where: { slug: data.slug },
    create: data,
    update: data,
  });
};

const creditPackageRepo = {
  getById,
  getBySlug,
  list,
  create,
  update,
  upsertBySlug,
};

export default creditPackageRepo;
