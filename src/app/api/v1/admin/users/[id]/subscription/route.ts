import { UpdateUserSubscriptionParams } from "@/lib/dtos/admin/user.dto";
import userService from "@/lib/services/admin/users";
import { adminHandler } from "@/lib/utils/handler.utils";
import { successResponse } from "@/lib/utils/response.utils";
import { AppRouteContext } from "@/lib/utils/types";
import {
  updateUserSubscriptionParamsValidator,
  updateUserSubscriptionDtoValidator,
} from "@/lib/validators/admin/user.validator";
import { NextResponse } from "next/server";

export const POST = adminHandler(
  async (req: Request, ctx: AppRouteContext<UpdateUserSubscriptionParams>) => {
    const body = await req.json();

    const params = updateUserSubscriptionParamsValidator.parse(
      await ctx.params,
    );
    const dto = updateUserSubscriptionDtoValidator.parse(body);

    await userService.updateUserSubscription(params, dto);
    const response = successResponse();
    return NextResponse.json(response);
  },
  { authenticate: true },
);
