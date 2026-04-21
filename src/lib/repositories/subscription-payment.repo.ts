import { SubscriptionPayment, Prisma } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";
import { DB } from "../db/types";
import { SubscriptionPaymentCreateArgs } from "@/generated/prisma/models";

const getById = async (
  id: SubscriptionPayment["id"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.subscriptionPayment.findUnique({
    where: { id },
  });
};

const create = async (
  data: SubscriptionPaymentCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;
  return await db.subscriptionPayment.create({
    data,
  });
};

const subscriptionPaymentRepo = {
  getById,
  create,
};

export default subscriptionPaymentRepo;
