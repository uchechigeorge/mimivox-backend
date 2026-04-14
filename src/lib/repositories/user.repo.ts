import { Prisma, User } from "@/generated/prisma/client";
import { DB, prisma } from "../db/prisma";
import {
  UserCreateArgs,
  UserFindManyArgs,
  UserUpdateArgs,
} from "@/generated/prisma/models";
import { BaseGetOptions, BaseGetParams } from "../dtos/shared/base-get-params";

const getById = async (id: User["id"], tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.user.findUnique({
    where: { id },
  });
};

const getByEmail = async (email: string, tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.user.findUnique({
    where: { email },
  });
};

const getExistsByEmail = async (
  email: string,
  tc?: Prisma.TransactionClient,
) => {
  const user = await getByEmail(email, tc);
  return user !== null;
};

const create = async (
  data: UserCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  return await prisma.user.create({
    data: {
      ...data,
      fullName: `${data.firstName.trim()} ${data.lastName}`.trim(),
    },
  });
};

const update = async (
  id: User["id"],
  data: UserUpdateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

// Order column options mapping
const sortColumnOptions: Record<string, string> = {
  fullName: "fullName",
  dateModified: "dateModified",
  dateCreated: "dateCreated",
};

export const query = async (
  params: UserGetParams,
  options?: UserGetOptions,
): Promise<[User[], number]> => {
  // Build `where` filter
  const where: UserFindManyArgs["where"] = {};

  if (params.id != null) where.id = params.id;
  if (params.blocked != null) where.blocked = params.blocked;
  if (params.searchString && params.searchString.trim() !== "") {
    where.fullName = { contains: params.searchString, mode: "insensitive" }; // LIKE '%searchString%'
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
  const total = await prisma.user.count({ where });
  const result = await prisma.user.findMany({
    where,
    orderBy,
    skip,
    take,
  });

  return [result, total];
};

type UserGetParams = BaseGetParams & {
  blocked?: boolean;
};

export type UserGetOptions = BaseGetOptions & {};

const userRepo = {
  getById,
  getByEmail,
  getExistsByEmail,
  create,
  update,
  query,
};

export default userRepo;
