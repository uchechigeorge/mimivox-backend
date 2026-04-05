// import { User } from "@/entities/user.entity";
import { User } from "@/generated/prisma/client";
import { isNullOrWhitespace } from "@/lib/utils/type";

export const getDefaultDp = async (user: User) => {
  if (!isNullOrWhitespace(user.dpUrl)) return user.dpUrl;

  let initials = (
    (user.firstName ?? "")[0] + (user.lastName ?? "")[0]
  ).toUpperCase();

  if (isNullOrWhitespace(initials)) initials = "ME";

  const url =
    (process.env.HOST ?? "") +
    `/api/v1/user/users/initials/${initials}?bg=${user.defaultBg}`;

  return url;
};
