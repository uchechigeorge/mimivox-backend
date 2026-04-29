import { User } from "@/generated/prisma/client";
import { isNotNullOrWhitespace } from "@/lib/utils/type.utils";

export const getDefaultDp = (user: User) => {
  if (isNotNullOrWhitespace(user.dpUrl)) return user.dpUrl;

  let initials = (
    (user.firstName ?? "")[0] + (user.lastName ?? "")[0]
  ).toUpperCase();

  if (!isNotNullOrWhitespace(initials)) initials = "ME";

  const url =
    (process.env.HOST ?? "") +
    `/api/v1/user/users/initials/${initials}?bg=${user.defaultBg}`;

  return url;
};
