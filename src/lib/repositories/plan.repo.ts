import { Plan, Prisma } from "@/generated/prisma/client";
import { DB, prisma } from "../db/prisma";

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
  getById,
  getBySlug,
  getByIsFree,
};

export default planRepo;
