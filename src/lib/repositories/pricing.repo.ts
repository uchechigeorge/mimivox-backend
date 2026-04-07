import { Pricing } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";

const getById = async (id: Pricing["id"]) => {
  return await prisma.pricing.findUnique({
    where: { id },
  });
};
const pricingRepo = {
  getById,
};

export default pricingRepo;
