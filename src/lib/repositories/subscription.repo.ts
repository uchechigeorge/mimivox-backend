import { $Enums, Prisma, Subscription, User } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";
import { DB } from "../db/types";
import {
  SubscriptionCreateArgs,
  SubscriptionFindManyArgs,
  SubscriptionUpdateArgs,
  SubscriptionUpsertArgs,
} from "@/generated/prisma/models";
import { BaseGetOptions, BaseGetParams } from "../dtos/shared/base-get-params";
import { isNotNullOrWhitespace } from "../utils/type.utils";

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

const getExistsByUserIdAndIsActive = async (
  userId: User["id"],
  isActive: boolean = true,
  tc?: Prisma.TransactionClient,
) => {
  const result = await getByUserIdAndIsActive(userId, isActive, tc);
  return result !== null;
};

const getByUserIdAndStatus = async (
  userId: User["id"],
  status: $Enums.SubscriptionStatus,
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.subscription.findFirst({
    where: { userId, status },
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

const getByPaymentToken = async (
  paymentToken: string,
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.subscription.findFirst({
    where: { paymentToken },
  });
};

const getExistsByPaymentToken = async (
  paymentToken: string,
  tc?: Prisma.TransactionClient,
) => {
  const result = await getByPaymentToken(paymentToken, tc);

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

const upsert = async (
  id: Subscription["id"] | undefined,
  create: SubscriptionUpsertArgs["create"],
  update: SubscriptionUpsertArgs["update"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.subscription.upsert({
    where: { id },
    create,
    update,
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

  if (isNotNullOrWhitespace(params.id)) where.id = params.id;
  if (isNotNullOrWhitespace(params.userId)) where.userId = params.userId;
  if (isNotNullOrWhitespace(params.reference))
    where.reference = params.reference;
  if (isNotNullOrWhitespace(params.paymentToken))
    where.paymentToken = params.paymentToken;
  if (isNotNullOrWhitespace(params.status)) where.status = params.status;
  if (params.isActive != null) where.isActive = params.isActive;
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
  userId?: string;
  reference?: string;
  paymentToken?: string;
  status?: $Enums.SubscriptionStatus;
  isActive?: boolean;
};

export type SubscriptionGetOptions = BaseGetOptions & {};

const subscriptionRepo = {
  getById,
  getByUserIdAndIsActive,
  getExistsByUserIdAndIsActive,
  getByUserIdAndStatus,
  getByReference,
  getExistsByReference,
  getByPaymentToken,
  getExistsByPaymentToken,
  create,
  update,
  upsert,
  query,
};

export default subscriptionRepo;
