import { Plan } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";

const getById = async (id: Plan["id"]) => {
  return await prisma.plan.findUnique({
    where: { id },
  });
};

const getBySlug = async (slug: string) => {
  return await prisma.plan.findUnique({
    where: { slug },
  });
};

const getByIsFree = async () => {
  return await prisma.plan.findFirst({
    where: { isFree: true },
  });
};

const planRepo = {
  getById,
  getBySlug,
  getByIsFree,
};

export default planRepo;
