import { Pricing, PricingSetting, Prisma } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";
import { DB } from "../db/types";
import { BaseGetOptions, BaseGetParams } from "../dtos/shared/base-get-params";
import {
  PricingSettingCreateArgs,
  PricingSettingFindManyArgs,
  PricingSettingUpdateArgs,
} from "@/generated/prisma/models";
import { isNotNullOrWhitespace } from "../utils/type.utils";

const getById = async (
  id: PricingSetting["id"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.pricingSetting.findUnique({
    where: { id },
  });
};

const getByPricingId = async (
  pricingId: Pricing["id"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.pricingSetting.findUnique({
    where: { pricingId },
  });
};

const create = async (
  data: PricingSettingCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.pricingSetting.create({
    data,
  });
};

const update = async (
  id: PricingSetting["id"],
  data: PricingSettingUpdateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.pricingSetting.update({
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
  params: PricingSettingGetParams,
  options?: PricingSettingGetOptions,
): Promise<[PricingSetting[], number]> => {
  // Build `where` filter
  const where: PricingSettingFindManyArgs["where"] = {};

  if (isNotNullOrWhitespace(params.id)) where.id = params.id;
  if (isNotNullOrWhitespace(params.pricingId)) where.pricingId = params.pricingId;
  if (params.searchString && params.searchString.trim() !== "") {
    where.pricingName = { contains: params.searchString, mode: "insensitive" };
  }

  // Determine sort column
  const sortColumn =
    sortColumnOptions[params.sortBy ?? "updatedAt"] ?? "updatedAt";

  // orderBy expects: { column: "asc" | "desc" }
  const orderBy = {
    [sortColumn]: params.sortOrder?.toLowerCase() === "desc" ? "desc" : "asc",
  };

  // Pagination
  const skip = ((params.page || 1) - 1) * (params.pageSize || 50);
  const take = params.pageSize || 50;

  // Execute query
  const total = await prisma.pricingSetting.count({ where });
  const result = await prisma.pricingSetting.findMany({
    where,
    orderBy,
    skip,
    take,
    include: {
      pricing: options?.includeRelations,
    },
  });

  return [result, total];
};

type PricingSettingGetParams = BaseGetParams & {
  pricingId?: string;
};

export type PricingSettingGetOptions = BaseGetOptions & {};

const pricingSettingRepo = {
  getById,
  getByPricingId,
  create,
  update,
  query,
};

export default pricingSettingRepo;
