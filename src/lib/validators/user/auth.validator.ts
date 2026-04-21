import { rString } from "@/lib/utils/zod.utils";
import z from "zod";

export const loginValidator = z.object({
  email: rString,
  password: rString,
});

export const registerValidator = z.object({
  email: rString,
  password: rString,
  firstName: rString,
  lastName: rString,
});

export const userResetPasswordValidator = z.object({
  oldPassword: rString,
  newPassword: rString,
});
