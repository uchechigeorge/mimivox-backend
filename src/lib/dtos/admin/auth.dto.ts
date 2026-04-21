import {
  adminLoginValidator,
  adminResetPasswordValidator,
} from "@/lib/validators/admin/auth.validator";
import z from "zod";

export type AdminLoginDto = z.infer<typeof adminLoginValidator>;
export type AdminResetPasswordDto = z.infer<typeof adminResetPasswordValidator>;
