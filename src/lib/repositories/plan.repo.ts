import { Plan, Prisma } from "@/generated/prisma/client";
import { DB, prisma } from "../db/prisma";

const exists = async (tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;
  return (await db.plan.count()) > 0;
};

const getById = async (id: Plan["id"], tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.plan.findUnique({
    where: { id },
  });
};

const getBySlug = async (slug: string, tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.plan.findUnique({
    where: { slug },
  });
};

const getByIsFree = async (tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.plan.findFirst({
    where: { isFree: true },
  });
};

const planRepo = {
  exists,
  getById,
  getBySlug,
  getByIsFree,
};

export default planRepo;
