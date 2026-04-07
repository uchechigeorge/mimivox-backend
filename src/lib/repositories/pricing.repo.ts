import { Pricing, Prisma } from "@/generated/prisma/client";
import { DB, prisma } from "../db/prisma";

const getById = async (id: Pricing["id"], tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.pricing.findUnique({
    where: { id },
  });
};

const pricingRepo = {
  getById,
};

export default pricingRepo;
