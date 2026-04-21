import {
  loginValidator,
  registerValidator,
  userResetPasswordValidator,
} from "@/lib/validators/user/auth.validator";
import z from "zod";

export type LoginDto = z.infer<typeof loginValidator>;
export type RegisterDto = z.infer<typeof registerValidator>;
export type UserResetPasswordDto = z.infer<typeof userResetPasswordValidator>;
