import { PaystackPlan, Prisma } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";
import { DB } from "../db/types";
import {
  PaystackPlanCreateArgs,
  PaystackPlanUpdateArgs,
  PaystackPlanUpsertArgs,
} from "@/generated/prisma/models";

const getById = async (
  id: PaystackPlan["id"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.paystackPlan.findUnique({
    where: { id },
  });
};

const getByPricingId = async (
  pricingId: string,
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.paystackPlan.findFirst({
    where: { pricingId },
  });
};

const create = async (
  data: PaystackPlanCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;
  return await db.paystackPlan.create({
    data,
  });
};

const update = async (
  id: PaystackPlan["id"],
  data: PaystackPlanUpdateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;
  return await db.paystackPlan.update({
    where: { id },
    data,
  });
};

const upsert = async (
  id: PaystackPlan["id"] | undefined,
  create: PaystackPlanUpsertArgs["create"],
  update: PaystackPlanUpsertArgs["update"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.paystackPlan.upsert({
    where: { id },
    create,
    update,
  });
};

const paystackPlanRepo = {
  getById,
  getByPricingId,
  create,
  update,
  upsert,
};

export default paystackPlanRepo;
