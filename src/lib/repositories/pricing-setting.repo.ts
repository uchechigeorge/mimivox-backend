import { Pricing, PricingSetting, Prisma } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";
import { DB } from "../db/types";

const getById = async (
  id: PricingSetting["id"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.pricingSetting.findUnique({
    where: { id },
  });
};

const getByPricingId = async (
  pricingId: Pricing["id"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.pricingSetting.findUnique({
    where: { pricingId },
  });
};

const pricingSettingRepo = {
  getById,
  getByPricingId,
};

export default pricingSettingRepo;
