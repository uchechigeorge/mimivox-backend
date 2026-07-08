import { PaystackInvoice, Prisma } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";
import { DB } from "../db/types";
import {
  PaystackInvoiceCreateArgs,
  PaystackInvoiceUpdateArgs,
} from "@/generated/prisma/models";

const getById = async (
  id: PaystackInvoice["id"],
  tx?: Prisma.TransactionClient,
) => {
  const db: DB = tx || prisma;

  return await db.paystackInvoice.findUnique({
    where: { id },
  });
};

const getBySubscriptionPaymentId = async (
  subscriptionPaymentId: string,
  tx?: Prisma.TransactionClient,
) => {
  const db: DB = tx || prisma;

  return await db.paystackInvoice.findFirst({
    where: { subscriptionPaymentId },
  });
};

const getByReference = async (
  reference: string,
  tx?: Prisma.TransactionClient,
) => {
  const db: DB = tx || prisma;

  return await db.paystackInvoice.findFirst({
    where: { reference },
  });
};

const create = async (
  data: PaystackInvoiceCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;
  return await db.paystackInvoice.create({
    data,
  });
};

const update = async (
  id: PaystackInvoice["id"],
  data: PaystackInvoiceUpdateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;
  return await db.paystackInvoice.update({
    where: { id },
    data,
  });
};

const paystackInvoiceRepo = {
  getById,
  getBySubscriptionPaymentId,
  getByReference,
  create,
  update,
};

export default paystackInvoiceRepo;
