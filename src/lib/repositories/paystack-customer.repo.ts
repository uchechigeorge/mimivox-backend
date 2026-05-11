import { PaystackCustomer, Prisma } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";
import { DB } from "../db/types";
import {
  PaystackCustomerCreateArgs,
  PaystackCustomerUpdateArgs,
} from "@/generated/prisma/models";

const getById = async (
  id: PaystackCustomer["id"],
  tx?: Prisma.TransactionClient,
) => {
  const db: DB = tx || prisma;

  return await db.paystackCustomer.findUnique({
    where: { id },
  });
};

const getByUserId = async (userId: string, tx?: Prisma.TransactionClient) => {
  const db: DB = tx || prisma;

  return await db.paystackCustomer.findFirst({
    where: { userId },
  });
};

const getByReference = async (
  reference: string,
  tx?: Prisma.TransactionClient,
) => {
  const db: DB = tx || prisma;

  return await db.paystackCustomer.findFirst({
    where: { reference },
  });
};

const getByEmail = async (email: string, tx?: Prisma.TransactionClient) => {
  const db: DB = tx || prisma;

  return await db.paystackCustomer.findFirst({
    where: { email },
  });
};

const create = async (
  data: PaystackCustomerCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;
  return await db.paystackCustomer.create({
    data,
  });
};

const update = async (
  id: PaystackCustomer["id"],
  data: PaystackCustomerUpdateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;
  return await db.paystackCustomer.update({
    where: { id },
    data,
  });
};

const paystackCustomerRepo = {
  getById,
  getByUserId,
  getByReference,
  getByEmail,
  create,
  update,
};

export default paystackCustomerRepo;
