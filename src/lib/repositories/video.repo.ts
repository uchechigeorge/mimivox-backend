import { Video, Prisma, User } from "@/generated/prisma/client";
import { DB, prisma } from "../db/prisma";
import { VideoCreateArgs, VideoFindManyArgs } from "@/generated/prisma/models";
import { BaseGetOptions, BaseGetParams } from "../dtos/shared/base-get-params";

const getById = async (id: Video["id"], tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.video.findUnique({
    where: { id },
  });
};

const create = async (
  data: VideoCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;
  return await db.video.create({
    data,
  });
};

// Order column options mapping
const sortColumnOptions: Record<string, string> = {
  updatedAt: "updatedAt",
  createdAt: "createdAt",
};

export const query = async (
  params: VideoGetParams,
  options?: VideoGetOptions,
): Promise<[Video[], number]> => {
  // Build `where` filter
  const where: VideoFindManyArgs["where"] = {};

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
  const total = await prisma.video.count({ where });
  const result = await prisma.video.findMany({
    where,
    orderBy,
    skip,
    take,
  });

  return [result, total];
};

type VideoGetParams = BaseGetParams & {
  userId?: User["id"];
};

export type VideoGetOptions = BaseGetOptions & {};

const videoRepo = {
  getById,
  create,
  query,
};

export default videoRepo;
