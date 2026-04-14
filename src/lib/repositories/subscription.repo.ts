import { Prisma, Subscription, User } from "@/generated/prisma/client";
import { DB, prisma } from "../db/prisma";
import {
  SubscriptionCreateArgs,
  SubscriptionUpdateArgs,
} from "@/generated/prisma/models";

const getByUserIdAndIsActive = async (
  userId: User["id"],
  isActive: boolean = true,
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.subscription.findFirst({
    where: { userId, isActive },
  });
};

const getByReference = async (
  reference: string,
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.subscription.findFirst({
    where: { reference },
  });
};

const getExistsByReference = async (
  reference: string,
  tc?: Prisma.TransactionClient,
) => {
  const result = await getByReference(reference, tc);

  return result !== null;
};

const create = async (
  data: SubscriptionCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.subscription.create({
    data,
  });
};

const update = async (
  id: Subscription["id"],
  data: SubscriptionUpdateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.subscription.update({
    where: { id },
    data,
  });
};

const subscriptionRepo = {
  getByUserIdAndIsActive,
  getByReference,
  getExistsByReference,
  create,
  update,
};

export default subscriptionRepo;
