import { Subscription, User } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";
import {
  SubscriptionCreateArgs,
  SubscriptionUpdateArgs,
} from "@/generated/prisma/models";

const getByUserIdAndIsActive = async (
  userId: User["id"],
  isActive: boolean = true,
) => {
  return await prisma.subscription.findFirst({
    where: { userId, isActive },
  });
};

const create = async (data: SubscriptionCreateArgs["data"]) => {
  return await prisma.subscription.create({
    data,
  });
};

const update = async (
  id: Subscription["id"],
  data: SubscriptionUpdateArgs["data"],
) => {
  return await prisma.subscription.update({
    where: { id },
    data,
  });
};

const subscriptionRepo = {
  getByUserIdAndIsActive,
  create,
  update,
};

export default subscriptionRepo;
