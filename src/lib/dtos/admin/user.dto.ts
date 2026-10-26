import {
  grantUserCreditsDtoValidator,
  grantUserCreditsParamsValidator,
  listUserActivityLogsParamsValidator,
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

export type GrantUserCreditsParams = z.infer<
  typeof grantUserCreditsParamsValidator
>;

export type GrantUserCreditsDto = z.infer<typeof grantUserCreditsDtoValidator>;

export type ListUserActivityLogsParams = z.infer<
  typeof listUserActivityLogsParamsValidator
>;
