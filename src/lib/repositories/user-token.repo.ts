import { UserToken, Prisma, $Enums } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";
import { DB } from "../db/types";
import {
  UserTokenCreateArgs,
  UserTokenUpdateArgs,
} from "@/generated/prisma/models";

const getById = async (id: UserToken["id"], tc?: Prisma.TransactionClient) => {
  const db: DB = tc || prisma;

  return await db.userToken.findUnique({
    where: { id },
  });
};

const getByUserIdAndType = async (
  userId: string,
  type: $Enums.AuthTokenType,
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.userToken.findFirst({
    where: { userId, type },
  });
};

const getByTokenAndType = async (
  token: string,
  type: $Enums.AuthTokenType,
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.userToken.findFirst({
    where: { token, type },
  });
};

const getByUserIdTokenAndType = async (
  userId: string,
  token: string,
  type: $Enums.AuthTokenType,
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.userToken.findFirst({
    where: { userId, token, type },
  });
};

const checkExpiry = async (
  userId: string,
  token: string,
  type: $Enums.AuthTokenType,
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  const result = await db.userToken.findFirst({
    where: { userId, type, token, expiresAt: { gte: new Date() } },
    select: { id: true },
  });

  return !!result;
};

const create = async (
  data: UserTokenCreateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.userToken.create({
    data,
  });
};

const update = async (
  id: UserToken["id"],
  data: UserTokenUpdateArgs["data"],
  tc?: Prisma.TransactionClient,
) => {
  const db: DB = tc || prisma;

  return await db.userToken.update({
    where: { id },
    data,
  });
};

const userTokenRepo = {
  getById,
  getByUserIdAndType,
  getByTokenAndType,
  getByUserIdTokenAndType,
  checkExpiry,
  create,
  update,
};

export default userTokenRepo;
