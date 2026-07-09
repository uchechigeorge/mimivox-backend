import {
  SubscriptionPayment,
  Prisma,
  Subscription,
} from "@/generated/prisma/client";
import { prisma } from "../db/prisma";
import { DB } from "../db/types";
import {
  SubscriptionPaymentCreateArgs,
  SubscriptionPaymentFindManyArgs,
  SubscriptionPaymentUpdateArgs,
} from "@/generated/prisma/models";
import { BaseGetOptions, BaseGetParams } from "../dtos/shared/base-get-params";
import { isNotNullOrWhitespace } from "../utils/type.utils";

const getById = async (
  id: SubscriptionPayment["id"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.subscriptionPayment.findUnique({
    where: { id },
  });
};

const getByIsCurrentAndPending = async (
  subscriptionId: Subscription["id"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.subscriptionPayment.findFirst({
    where: { subscriptionId, isCurrent: true, status: "Pending" },
  });
};

const create = async (
  data: SubscriptionPaymentCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;
  return await db.subscriptionPayment.create({
    data,
  });
};

const update = async (
  id: SubscriptionPayment["id"],
  data: SubscriptionPaymentUpdateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.subscriptionPayment.update({
    where: { id },
    data,
  });
};

const updateBySubscriptionId = async (
  subscriptionId: Subscription["id"],
  data: SubscriptionPaymentUpdateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.subscriptionPayment.updateMany({
    where: { subscriptionId },
    data,
  });
};

// Order column options mapping
const sortColumnOptions: Record<string, string> = {
  paidAt: "paidAt",
  updatedAt: "updatedAt",
  createdAt: "createdAt",
};

export const query = async (
  params: SubscriptionPaymentGetParams,
  options?: SubscriptionPaymentGetOptions,
): Promise<[SubscriptionPayment[], number]> => {
  const where: SubscriptionPaymentFindManyArgs["where"] = {};

  if (isNotNullOrWhitespace(params.id)) where.id = params.id;
  if (isNotNullOrWhitespace(params.userId)) where.userId = params.userId;
  if (isNotNullOrWhitespace(params.subscriptionId))
    where.subscriptionId = params.subscriptionId;
  if (isNotNullOrWhitespace(params.subscriptionReference))
    where.subscriptionReference = params.subscriptionReference;
  if (params.searchString && params.searchString.trim() !== "") {
    where.subscriptionReference = {
      contains: params.searchString,
      mode: "insensitive",
    };
  }

  // Determine sort column
  const sortColumn = sortColumnOptions[params.sortBy ?? "paidAt"] ?? "paidAt";

  // orderBy expects: { column: "asc" | "desc" }
  const orderBy = {
    [sortColumn]: params.sortOrder?.toLowerCase() === "asc" ? "asc" : "desc",
  };

  // Pagination
  const skip = ((params.page || 1) - 1) * (params.pageSize || 50);
  const take = params.pageSize || 50;

  // Execute query
  const total = await prisma.subscriptionPayment.count({ where });
  const result = await prisma.subscriptionPayment.findMany({
    where,
    orderBy,
    skip,
    take,
    include: {
      subscription: options?.includeRelations,
    },
  });

  return [result, total];
};

type SubscriptionPaymentGetParams = BaseGetParams & {
  userId?: string;
  subscriptionId?: string;
  subscriptionReference?: string;
  paymentToken?: string;
};

export type SubscriptionPaymentGetOptions = BaseGetOptions & {};

const subscriptionPaymentRepo = {
  getById,
  getByIsCurrentAndPending,
  create,
  update,
  updateBySubscriptionId,
  query,
};

export default subscriptionPaymentRepo;
