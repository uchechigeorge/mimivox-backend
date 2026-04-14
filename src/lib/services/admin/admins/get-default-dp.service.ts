import { Admin } from "@/generated/prisma/client";
import { isNullOrWhitespace } from "@/lib/utils/type.utils";

export const getDefaultDp = (admin: Admin) => {
  if (!isNullOrWhitespace(admin.dpUrl)) return admin.dpUrl;

  let initials = (
    (admin.firstName ?? "")[0] + (admin.lastName ?? "")[0]
  ).toUpperCase();

  if (isNullOrWhitespace(initials)) initials = "ME";

  const url =
    (process.env.HOST ?? "") +
    `/api/v1/admin/admins/initials/${initials}?bg=${admin.defaultBg}`;

  return url;
};
