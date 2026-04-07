import {
  updateUserSubscriptionDtoValidator,
  updateUserSubscriptionParamsValidator,
  userGetAllParamsValidator,
  userReadDtoValidator,
} from "@/lib/validators/admin/user.validator";
import z from "zod";

export type UserGetAllParams = z.infer<typeof userGetAllParamsValidator>;

export type UserReadDto = z.infer<typeof userReadDtoValidator>;

export type UpdateUserSubscriptionParams = z.infer<
  typeof updateUserSubscriptionParamsValidator
>;

export type UpdateUserSubscriptionDto = z.infer<
  typeof updateUserSubscriptionDtoValidator
>;
