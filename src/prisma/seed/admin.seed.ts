import { AdminUpsertArgs } from "@/generated/prisma/models";
import { env } from "@/lib/config/env.config";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/services/admin/auth/auth-helpers.service";
import { randomColor } from "@/lib/utils/constants.utils";

export const seedAdmins = async () => {
  const email = env.INIT_ADMIN_EMAIL;
  const password = env.INIT_ADMIN_PASSWORD;
  const firstName = env.INIT_ADMIN_FIRST_NAME;
  const lastName = env.INIT_ADMIN_LAST_NAME;

  if (!(email && password && firstName && lastName)) return;

  const data: AdminUpsertArgs["create"] = {
    email,
    password: await hashPassword(password),
    firstName,
    lastName,
    fullName: `${firstName.trim()} ${lastName}`.trim(),
    defaultBg: randomColor,
  };
  await prisma.admin.upsert({
    where: { email: env.INIT_ADMIN_EMAIL },
    create: data,
    update: data,
  });
};
