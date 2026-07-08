import { Pricing, Prisma } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";
import { DB } from "../db/types";
import {
  PricingCreateArgs,
  PricingFindManyArgs,
  PricingUpdateArgs,
} from "@/generated/prisma/models";
import { isNotNullOrWhitespace } from "../utils/type.utils";
import { BaseGetOptions, BaseGetParams } from "../dtos/shared/base-get-params";

const getById = async (id: Pricing["id"], tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.pricing.findUnique({
    where: { id },
  });
};

const getByIsFree = async (tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.pricing.findFirst({
    where: { isFree: true },
  });
};

const create = async (
  data: PricingCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.pricing.create({
    data,
  });
};

const update = async (
  id: Pricing["id"],
  data: PricingUpdateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.pricing.update({
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
  params: PricingGetParams,
  options?: PricingGetOptions,
): Promise<[Pricing[], number]> => {
  // Build `where` filter
  const where: PricingFindManyArgs["where"] = {};

  if (isNotNullOrWhitespace(params.id)) where.id = params.id;
  if (isNotNullOrWhitespace(params.slug)) where.slug = params.slug;
  if (params.searchString && params.searchString.trim() !== "") {
    where.name = { contains: params.searchString, mode: "insensitive" };
  }

  // Determine sort column
  const sortColumn =
    sortColumnOptions[params.sortBy ?? "sequence"] ?? "sequence";

  // orderBy expects: { column: "asc" | "desc" }
  const orderBy = {
    [sortColumn]: params.sortOrder?.toLowerCase() === "desc" ? "desc" : "asc",
  };

  // Pagination
  const skip = ((params.page || 1) - 1) * (params.pageSize || 50);
  const take = params.pageSize || 50;

  // Execute query
  const total = await prisma.pricing.count({ where });
  const result = await prisma.pricing.findMany({
    where,
    orderBy,
    skip,
    take,
    include: {
      plan: options?.includeRelations,
    },
  });

  return [result, total];
};

type PricingGetParams = BaseGetParams & {
  slug?: string;
};

export type PricingGetOptions = BaseGetOptions & {};

const pricingRepo = {
  getById,
  getByIsFree,
  create,
  update,
  query,
};

export default pricingRepo;
