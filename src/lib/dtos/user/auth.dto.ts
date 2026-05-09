import {
  forgotPasswordConfirmTokenValidator,
  forgotPasswordSendEmailValidator,
  loginValidator,
  registerValidator,
  userResetPasswordValidator,
  verifyEmailConfirmTokenValidator,
} from "@/lib/validators/user/auth.validator";
import z from "zod";

export type LoginDto = z.infer<typeof loginValidator>;
export type RegisterDto = z.infer<typeof registerValidator>;
export type UserResetPasswordDto = z.infer<typeof userResetPasswordValidator>;
export type VerifyEmailConfirmTokenDto = z.infer<
  typeof verifyEmailConfirmTokenValidator
>;
export type ForgotPasswordSendEmailDto = z.infer<
  typeof forgotPasswordSendEmailValidator
>;
export type ForgotPasswordConfirmTokenDto = z.infer<
  typeof forgotPasswordConfirmTokenValidator
>;
