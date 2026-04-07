import userService from "@/lib/services/admin/user";
import { adminHandler } from "@/lib/utils/handler.utils";
import { successResponse } from "@/lib/utils/response";
import {
  updateUserSubscriptionParamsValidator,
  updateUserSubscriptionValidator,
} from "@/lib/validators/admin/user.validator";
import { NextResponse } from "next/server";

export const POST = adminHandler(async (req: Request, ctx: any) => {
  const body = await req.json();

  const params = updateUserSubscriptionParamsValidator.parse(await ctx.params);
  const dto = updateUserSubscriptionValidator.parse(body);

  await userService.updateUserSubscription(params.id, dto);
  const response = successResponse();
  return NextResponse.json(response);
});
