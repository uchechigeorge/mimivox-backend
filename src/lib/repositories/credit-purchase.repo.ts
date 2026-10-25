import { CreditPurchase, Prisma, User } from "@/generated/prisma/client";
import {
  CreditPurchaseCreateArgs,
  CreditPurchaseUpdateArgs,
} from "@/generated/prisma/models";
import { prisma } from "../db/prisma";
import { DB } from "../db/types";

const getByPaymentToken = async (
  paymentToken: CreditPurchase["paymentToken"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.creditPurchase.findFirst({
    where: { paymentToken, deletedAt: null },
  });
};

const listByUserId = async (
  userId: User["id"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.creditPurchase.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
};

const listAll = async (
  type?: CreditPurchase["type"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.creditPurchase.findMany({
    where: { ...(type && { type }), deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
};

const create = async (
  data: CreditPurchaseCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.creditPurchase.create({ data });
};

const update = async (
  id: CreditPurchase["id"],
  data: CreditPurchaseUpdateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.creditPurchase.update({
    where: { id },
    data,
  });
};

// Only one webhook call can flip a pending purchase to verified
const claimPendingPayment = async (
  id: CreditPurchase["id"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.creditPurchase.updateMany({
    where: { id, status: "Pending", paymentVerified: false },
    data: { paymentVerified: true },
  });
};

const creditPurchaseRepo = {
  getByPaymentToken,
  listByUserId,
  listAll,
  create,
  update,
  claimPendingPayment,
};

export default creditPurchaseRepo;
