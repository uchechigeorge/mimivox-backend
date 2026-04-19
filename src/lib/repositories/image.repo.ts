import { Image, Prisma, User } from "@/generated/prisma/client";
import { DB, prisma } from "../db/prisma";
import { ImageCreateArgs, ImageFindManyArgs } from "@/generated/prisma/models";
import { BaseGetOptions, BaseGetParams } from "../dtos/shared/base-get-params";

const getById = async (id: Image["id"], tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.image.findUnique({
    where: { id },
  });
};

const create = async (
  data: ImageCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;
  return await db.image.create({
    data,
  });
};

// Order column options mapping
const sortColumnOptions: Record<string, string> = {
  updatedAt: "updatedAt",
  createdAt: "createdAt",
};

export const query = async (
  params: ImageGetParams,
  options?: ImageGetOptions,
): Promise<[Image[], number]> => {
  // Build `where` filter
  const where: ImageFindManyArgs["where"] = {};

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
  const total = await prisma.image.count({ where });
  const result = await prisma.image.findMany({
    where,
    orderBy,
    skip,
    take,
  });

  return [result, total];
};

type ImageGetParams = BaseGetParams & {
  userId?: User["id"];
};

export type ImageGetOptions = BaseGetOptions & {};

const imageRepo = {
  getById,
  create,
  query,
};

export default imageRepo;
