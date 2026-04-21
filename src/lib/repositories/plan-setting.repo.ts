import { Plan, PlanSetting, Prisma } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";
import { DB } from "../db/types";

const getById = async (
  id: PlanSetting["id"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.planSetting.findUnique({
    where: { id },
  });
};

const getByPlanId = async (
  planId: Plan["id"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.planSetting.findUnique({
    where: { planId },
  });
};

const planSettingRepo = {
  getById,
  getByPlanId,
};

export default planSettingRepo;
