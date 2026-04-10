import { Audio, Prisma, User } from "@/generated/prisma/client";
import { DB, prisma } from "../db/prisma";
import { AudioCreateArgs, AudioFindManyArgs } from "@/generated/prisma/models";
import { BaseGetOptions, BaseGetParams } from "../dtos/shared/base-get-params";

const getById = async (id: Audio["id"], tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.audio.findUnique({
    where: { id },
  });
};

const create = async (
  data: AudioCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;
  return await db.audio.create({
    data,
  });
};

// Order column options mapping
const sortColumnOptions: Record<string, string> = {
  updatedAt: "updatedAt",
  createdAt: "createdAt",
};

export const query = async (
  params: AudioGetParams,
  options?: AudioGetOptions,
): Promise<[Audio[], number]> => {
  // Build `where` filter
  const where: AudioFindManyArgs["where"] = {};

  if (params.id != null) where.id = params.id;
  if (params.userId != null) where.userId = params.userId;
  if (params.searchString && params.searchString.trim() !== "") {
    where.voiceName = { contains: params.searchString, mode: "insensitive" };
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
  const total = await prisma.audio.count({ where });
  const result = await prisma.audio.findMany({
    where,
    orderBy,
    skip,
    take,
  });

  return [result, total];
};

type AudioGetParams = BaseGetParams & {
  userId?: User["id"];
};

export type AudioGetOptions = BaseGetOptions & {};

const audioRepo = {
  getById,
  create,
  query,
};

export default audioRepo;
