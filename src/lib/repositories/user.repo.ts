import { Prisma, User } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";
import { UserCreateArgs, UserUpdateArgs } from "@/generated/prisma/models";

const getById = async (id: Prisma.UserWhereUniqueInput["id"]) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

const getByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

const getExistsByEmail = async (email: string) => {
  const user = await getByEmail(email);
  return user !== null;
};

const create = async (data: UserCreateArgs["data"]) => {
  return await prisma.user.create({
    data: {
      ...data,
      fullName: `${data.firstName.trim()} ${data.lastName}`.trim(),
    },
  });
};

const update = async (id: User["id"], data: UserUpdateArgs["data"]) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

const userRepo = {
  getById,
  getByEmail,
  getExistsByEmail,
  create,
  update,
};

export default userRepo;
