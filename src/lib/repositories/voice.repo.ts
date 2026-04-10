import { Voice, Prisma, $Enums, User } from "@/generated/prisma/client";
import { DB, prisma } from "../db/prisma";
import {
  VoiceAggregateArgs,
  VoiceCreateArgs,
  VoiceCreateManyArgs,
  VoiceFindManyArgs,
} from "@/generated/prisma/models";
import { BaseGetOptions, BaseGetParams } from "../dtos/shared/base-get-params";

const exists = async (tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;
  return (await db.voice.count()) > 0;
};

const getMaxSequence = async (
  where?: VoiceAggregateArgs["where"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;
  const max = await db.voice.aggregate({
    where,
    _max: {
      sequence: true,
    },
  });

  return (max._max.sequence ?? 0) + 1;
};

const getById = async (id: Voice["id"], tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.voice.findUnique({
    where: { id },
  });
};

const getByAudioServiceReference = async (
  audioServiceReferenceId: string,
  audioServiceType: $Enums.AudioServiceType,
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.voice.findUnique({
    where: {
      audioServiceType_audioServiceReferenceId: {
        audioServiceReferenceId,
        audioServiceType,
      },
    },
  });
};

const create = async (
  data: VoiceCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;
  return await db.voice.create({
    data,
  });
};

const createMany = async (
  data: VoiceCreateManyArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;
  return await db.voice.createMany({
    data,
  });
};

// Order column options mapping
const sortColumnOptions: Record<string, string> = {
  updatedAt: "updatedAt",
  createdAt: "createdAt",
};

export const query = async (
  params: VoiceGetParams,
  options?: VoiceGetOptions,
): Promise<[Voice[], number]> => {
  // Build `where` filter
  const where: VoiceFindManyArgs["where"] = {};

  if (params.id != null) where.id = params.id;
  if (params.type != null) where.type = params.type;
  if (params.userId != null)
    where.OR = [{ userId: params.userId }, { userId: null }];
  if (params.searchString && params.searchString.trim() !== "") {
    where.name = { contains: params.searchString, mode: "insensitive" };
  }

  // Determine sort column
  const sortColumn =
    sortColumnOptions[params.sortBy ?? "createdAt"] ?? "createdAt";

  const orderBy = {
    [sortColumn]: params.sortOrder?.toLowerCase() === "asc" ? "asc" : "desc",
  };

  // Pagination
  const skip = ((params.page || 1) - 1) * (params.pageSize || 50);
  const take = params.pageSize || 50;

  // Execute query
  const total = await prisma.voice.count({ where });
  const result = await prisma.voice.findMany({
    where,
    orderBy,
    skip,
    take,
  });

  return [result, total];
};

type VoiceGetParams = BaseGetParams & {
  userId?: User["id"];
  type?: Voice["type"];
};

export type VoiceGetOptions = BaseGetOptions & {};

const voiceRepo = {
  exists,
  getMaxSequence,
  getById,
  getByAudioServiceReference,
  create,
  createMany,
  query,
};

export default voiceRepo;
