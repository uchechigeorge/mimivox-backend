import { Prisma } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";
import { UserCreateInput } from "@/generated/prisma/models";

const create = async (data: UserCreateInput) => {
  return await prisma.user.create({
    data: {
      ...data,
      fullName: `${data.firstName.trim()} ${data.lastName}`.trim(),
    },
  });
};

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

const userRepo = {
  create,
  getById,
  getByEmail,
  getExistsByEmail,
};

export default userRepo;
