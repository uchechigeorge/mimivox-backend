import { updateUserSubscriptionValidator } from "@/lib/validators/admin/user.validator";
import z from "zod";

export type UpdateUserSubscription = z.infer<
  typeof updateUserSubscriptionValidator
>;
