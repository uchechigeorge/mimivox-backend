import { adminLoginValidator } from "@/lib/validators/admin/auth.validator";
import z from "zod";

export type AdminLoginDto = z.infer<typeof adminLoginValidator>;
