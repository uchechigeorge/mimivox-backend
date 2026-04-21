import { Music, Prisma, User } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";
import { DB } from "../db/types";
import {
  MusicCreateArgs,
  MusicFindManyArgs,
  MusicUpdateArgs,
} from "@/generated/prisma/models";
import { BaseGetOptions, BaseGetParams } from "../dtos/shared/base-get-params";

const getById = async (id: Music["id"], tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.music.findUnique({
    where: { id },
  });
};

const getByReference = async (
  musicServiceReferenceId: string,
  musicServiceType: Music["musicServiceType"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.music.findFirst({
    where: { musicServiceReferenceId, musicServiceType },
  });
};

const create = async (
  data: MusicCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.music.create({
    data,
  });
};

const update = async (
  id: Music["id"],
  data: MusicUpdateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;
  return await db.music.update({
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
  params: MusicGetParams,
  options?: MusicGetOptions,
): Promise<[Music[], number]> => {
  // Build `where` filter
  const where: MusicFindManyArgs["where"] = {};

  if (params.id != null) where.id = params.id;
  if (params.userId != null) where.userId = params.userId;
  if (params.searchString && params.searchString.trim() !== "") {
    where.prompt = { contains: params.searchString, mode: "insensitive" };
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
  const total = await prisma.music.count({ where });
  const result = await prisma.music.findMany({
    where,
    orderBy,
    skip,
    take,
  });

  return [result, total];
};

type MusicGetParams = BaseGetParams & {
  userId?: User["id"];
};

export type MusicGetOptions = BaseGetOptions & {};

const musicRepo = {
  getById,
  getByReference,
  create,
  update,
  query,
};

export default musicRepo;
