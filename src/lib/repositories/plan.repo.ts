import { Plan, Prisma } from "@/generated/prisma/client";
import { DB, prisma } from "../db/prisma";
import { PlanFindManyArgs } from "@/generated/prisma/models";
import { BaseGetOptions, BaseGetParams } from "../dtos/shared/base-get-params";
import { isNullOrWhitespace } from "../utils/type.utils";

const exists = async (tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;
  return (await db.plan.count()) > 0;
};

const getById = async (id: Plan["id"], tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.plan.findUnique({
    where: { id },
  });
};

const getBySlug = async (slug: string, tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.plan.findUnique({
    where: { slug },
  });
};

const getByIsFree = async (tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.plan.findFirst({
    where: { isFree: true },
  });
};

// Order column options mapping
const sortColumnOptions: Record<string, string> = {
  updatedAt: "updatedAt",
  createdAt: "createdAt",
};

export const query = async (
  params: PlanGetParams,
  options?: PlanGetOptions,
): Promise<[Plan[], number]> => {
  // Build `where` filter
  const where: PlanFindManyArgs["where"] = {};

  if (params.id != null) where.id = params.id;
  if (!isNullOrWhitespace(params.slug)) where.slug = params.slug;
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
  const total = await prisma.plan.count({ where });
  const result = await prisma.plan.findMany({
    where,
    orderBy,
    skip,
    take,
    include: {
      pricings: options?.includeRelations,
      settings: options?.includeRelations,
    },
  });

  return [result, total];
};

type PlanGetParams = BaseGetParams & {
  slug?: string;
};

export type PlanGetOptions = BaseGetOptions & {};

const planRepo = {
  exists,
  getById,
  getBySlug,
  getByIsFree,
  query,
};

export default planRepo;
