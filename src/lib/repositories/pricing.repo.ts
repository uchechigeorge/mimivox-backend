import { Pricing, Prisma } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";
import { DB } from "../db/types";
import {
  PricingCreateArgs,
  PricingUpdateArgs,
} from "@/generated/prisma/models";

const getById = async (id: Pricing["id"], tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.pricing.findUnique({
    where: { id },
  });
};

const create = async (
  data: PricingCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.pricing.create({
    data,
  });
};

const update = async (
  id: Pricing["id"],
  data: PricingUpdateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.pricing.update({
    where: { id },
    data,
  });
};

const pricingRepo = {
  getById,
  create,
  update,
};

export default pricingRepo;
