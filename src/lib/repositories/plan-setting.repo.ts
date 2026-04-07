import { Plan, PlanSetting } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";

const getById = async (id: PlanSetting["id"]) => {
  return await prisma.planSetting.findUnique({
    where: { id },
  });
};

const getByPlanId = async (planId: Plan["id"]) => {
  return await prisma.planSetting.findUnique({
    where: { planId },
  });
};

const planSettingRepo = {
  getById,
  getByPlanId,
};

export default planSettingRepo;
