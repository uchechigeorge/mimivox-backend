import { rString } from "@/lib/utils/zod.utils";
import z from "zod";

export const adminLoginValidator = z.object({
  email: rString,
  password: rString,
});
