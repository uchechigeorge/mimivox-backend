import { Voice, Prisma, $Enums } from "@/generated/prisma/client";
import { DB, prisma } from "../db/prisma";
import {
  VoiceAggregateArgs,
  VoiceCreateArgs,
  VoiceCreateManyArgs,
} from "@/generated/prisma/models";

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

const voiceRepo = {
  exists,
  getMaxSequence,
  getById,
  getByAudioServiceReference,
  create,
  createMany,
};

export default voiceRepo;
