import { PaystackSubscription, Prisma } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";
import { DB } from "../db/types";
import {
  PaystackSubscriptionCreateArgs,
  PaystackSubscriptionUpdateArgs,
} from "@/generated/prisma/models";

const getById = async (
  id: PaystackSubscription["id"],
  tx?: Prisma.TransactionClient,
) => {
  const db: DB = tx || prisma;

  return await db.paystackSubscription.findUnique({
    where: { id },
  });
};

const getBySubscriptionId = async (
  subscriptionId: string,
  tx?: Prisma.TransactionClient,
) => {
  const db: DB = tx || prisma;

  return await db.paystackSubscription.findFirst({
    where: { subscriptionId },
  });
};

const getByReference = async (
  reference: string,
  tx?: Prisma.TransactionClient,
) => {
  const db: DB = tx || prisma;

  return await db.paystackSubscription.findFirst({
    where: { reference },
  });
};

const create = async (
  data: PaystackSubscriptionCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;
  return await db.paystackSubscription.create({
    data,
  });
};

const update = async (
  id: PaystackSubscription["id"],
  data: PaystackSubscriptionUpdateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;
  return await db.paystackSubscription.update({
    where: { id },
    data,
  });
};

const paystackSubscriptionRepo = {
  getById,
  getBySubscriptionId,
  getByReference,
  create,
  update,
};

export default paystackSubscriptionRepo;
