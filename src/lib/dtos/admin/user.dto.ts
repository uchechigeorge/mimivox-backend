import {
  updateUserSubscriptionDtoValidator,
  updateUserSubscriptionParamsValidator,
  userGetParamsValidator,
  userListParamsValidator,
  userReadDtoValidator,
} from "@/lib/validators/admin/user.validator";
import z from "zod";

export type UserListParams = z.infer<typeof userListParamsValidator>;
export type UserGetParams = z.infer<typeof userGetParamsValidator>;

export type UserReadDto = z.infer<typeof userReadDtoValidator>;

export type UpdateUserSubscriptionParams = z.infer<
  typeof updateUserSubscriptionParamsValidator
>;

export type UpdateUserSubscriptionDto = z.infer<
  typeof updateUserSubscriptionDtoValidator
>;
