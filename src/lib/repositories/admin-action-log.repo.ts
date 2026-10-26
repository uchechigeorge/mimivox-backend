import { AdminActionLog, Prisma, User } from "@/generated/prisma/client";
import { AdminActionLogCreateArgs } from "@/generated/prisma/models";
import { prisma } from "../db/prisma";
import { DB } from "../db/types";

const create = async (
  data: AdminActionLogCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.adminActionLog.create({ data });
};

const listByUserId = async (
  userId: User["id"],
  page = 1,
  pageSize = 50,
): Promise<[AdminActionLog[], number]> => {
  const where = { userId };

  return await Promise.all([
    prisma.adminActionLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.adminActionLog.count({ where }),
  ]);
};

// Credit top ups and additions an admin made, for the user's own history
const listCreditsByUserId = async (userId: User["id"]) =>
  await prisma.adminActionLog.findMany({
    where: { userId, action: { in: ["CreditTopUp", "CreditAdded"] } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

const adminActionLogRepo = {
  create,
  listCreditsByUserId,
  listByUserId,
};

export default adminActionLogRepo;
