import { Pricing, Prisma, Task, User } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";
import { DB } from "../db/types";
import {
  TaskCreateArgs,
  TaskFindManyArgs,
  TaskUpdateArgs,
} from "@/generated/prisma/models";
import { BaseGetOptions, BaseGetParams } from "../dtos/shared/base-get-params";

const getById = async (id: Pricing["id"], tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.task.findUnique({
    where: { id },
  });
};

const getByReference = async (
  referenceId: string,
  type: Task["type"],
  serviceOption: Task["serviceOption"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.task.findFirst({
    where: { referenceId, type, serviceOption },
  });
};

const create = async (
  data: TaskCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.task.create({
    data,
  });
};

const update = async (
  id: Task["id"],
  data: TaskUpdateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.task.update({
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
  params: TaskGetParams,
  options?: TaskGetOptions,
): Promise<[Task[], number]> => {
  // Build `where` filter
  const where: TaskFindManyArgs["where"] = {};

  if (params.id != null) where.id = params.id;
  if (params.userId != null) where.userId = params.userId;
  if (params.type != null) where.type = params.type;
  if (params.status != null) where.status = params.status;
  if (params.serviceOption != null) where.serviceOption = params.serviceOption;
  if (params.searchString && params.searchString.trim() !== "") {
    where.userName = { contains: params.searchString, mode: "insensitive" };
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
  const total = await prisma.task.count({ where });
  const result = await prisma.task.findMany({
    where,
    orderBy,
    skip,
    take,
  });

  return [result, total];
};

type TaskGetParams = BaseGetParams & {
  userId?: User["id"];
  type?: Task["type"];
  status?: Task["status"];
  serviceOption?: Task["serviceOption"];
};

export type TaskGetOptions = BaseGetOptions & {};

const taskRepo = {
  getById,
  getByReference,
  create,
  update,
  query,
};

export default taskRepo;
