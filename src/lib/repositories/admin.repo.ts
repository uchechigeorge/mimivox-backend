import { Admin, Prisma } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";
import { DB } from "../db/types";
import {
  AdminCreateArgs,
  AdminFindManyArgs,
  AdminUpdateArgs,
} from "@/generated/prisma/models";
import { BaseGetOptions, BaseGetParams } from "../dtos/shared/base-get-params";
import { isNotNullOrWhitespace } from "../utils/type.utils";

const exists = async (tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;
  return (await db.admin.count()) > 0;
};

const getById = async (id: Admin["id"], tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.admin.findUnique({
    where: { id },
  });
};

const getByEmail = async (email: string, tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.admin.findUnique({
    where: { email },
  });
};

const getExistsByEmail = async (
  email: string,
  tc?: Prisma.TransactionClient,
) => {
  const admin = await getByEmail(email, tc);
  return admin !== null;
};

const create = async (
  data: AdminCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;
  return await db.admin.create({
    data: {
      ...data,
      fullName: `${data.firstName.trim()} ${data.lastName}`.trim(),
    },
  });
};

const update = async (
  id: Admin["id"],
  data: AdminUpdateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;
  return await db.admin.update({
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
  params: AdminGetParams,
  options?: AdminGetOptions,
): Promise<[Admin[], number]> => {
  // Build `where` filter
  const where: AdminFindManyArgs["where"] = {};

  if (isNotNullOrWhitespace(params.id)) where.id = params.id;
  if (params.blocked != null) where.blocked = params.blocked;
  if (isNotNullOrWhitespace(params.searchString)) {
    where.fullName = { contains: params.searchString, mode: "insensitive" };
  }

  // Determine sort column
  const sortColumn =
    sortColumnOptions[params.sortBy ?? "createdAt"] ?? "createdAt";

  // orderBy expects: { column: "asc" | "desc" }
  const orderBy = {
    [sortColumn]: params.sortOrder?.toLowerCase() === "asc" ? "asc" : "desc",
  };

  // Pagination
  const skip = ((params.page || 1) - 1) * (params.pageSize || 50);
  const take = params.pageSize || 50;

  // Execute query
  const total = await prisma.admin.count({ where });
  const result = await prisma.admin.findMany({
    where,
    orderBy,
    skip,
    take,
  });

  return [result, total];
};

type AdminGetParams = BaseGetParams & {
  blocked?: boolean;
};

export type AdminGetOptions = BaseGetOptions & {};

const adminRepo = {
  exists,
  getById,
  getByEmail,
  getExistsByEmail,
  create,
  update,
  query,
};

export default adminRepo;
