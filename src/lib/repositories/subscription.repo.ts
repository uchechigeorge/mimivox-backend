import { Prisma, Subscription, User } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";
import { DB } from "../db/types";
import {
  SubscriptionCreateArgs,
  SubscriptionFindManyArgs,
  SubscriptionUpdateArgs,
} from "@/generated/prisma/models";
import { BaseGetOptions, BaseGetParams } from "../dtos/shared/base-get-params";
import { isNullOrWhitespace } from "../utils/type.utils";

const getById = async (id: string, tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.subscription.findUnique({
    where: { id },
  });
};

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

// Order column options mapping
const sortColumnOptions: Record<string, string> = {
  updatedAt: "updatedAt",
  createdAt: "createdAt",
};

export const query = async (
  params: SubscriptionGetParams,
  options?: SubscriptionGetOptions,
): Promise<[Subscription[], number]> => {
  const where: SubscriptionFindManyArgs["where"] = {};

  if (params.id != null) where.id = params.id;
  if (!isNullOrWhitespace(params.reference)) where.reference = params.reference;
  if (params.searchString && params.searchString.trim() !== "") {
    where.reference = { contains: params.searchString, mode: "insensitive" };
  }

  // Determine sort column
  const sortColumn =
    sortColumnOptions[params.sortBy ?? "startDate"] ?? "startDate";

  // orderBy expects: { column: "asc" | "desc" }
  const orderBy = {
    [sortColumn]: params.sortOrder?.toLowerCase() === "asc" ? "asc" : "desc",
  };

  // Pagination
  const skip = ((params.page || 1) - 1) * (params.pageSize || 50);
  const take = params.pageSize || 50;

  // Execute query
  const total = await prisma.subscription.count({ where });
  const result = await prisma.subscription.findMany({
    where,
    orderBy,
    skip,
    take,
    include: {
      user: options?.includeRelations,
    },
  });

  return [result, total];
};

type SubscriptionGetParams = BaseGetParams & {
  reference?: string;
};

export type SubscriptionGetOptions = BaseGetOptions & {};

const subscriptionRepo = {
  getById,
  getByUserIdAndIsActive,
  getByReference,
  getExistsByReference,
  create,
  update,
  query,
};

export default subscriptionRepo;
