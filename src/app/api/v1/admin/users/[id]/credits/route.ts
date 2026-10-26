import { GrantUserCreditsParams } from "@/lib/dtos/admin/user.dto";
import userService from "@/lib/services/admin/users";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getResponse } from "@/lib/utils/response.utils";
import { AppRouteContext } from "@/lib/utils/types";
import {
  grantUserCreditsDtoValidator,
  grantUserCreditsParamsValidator,
} from "@/lib/validators/admin/user.validator";
import { NextRequest, NextResponse } from "next/server";

export const POST = adminHandler(
  async (
    req: NextRequest,
    ctx: AppRouteContext<GrantUserCreditsParams>,
    authItems,
  ) => {
    const body = await req.json();

    const params = grantUserCreditsParamsValidator.parse(await ctx.params);
    const dto = grantUserCreditsDtoValidator.parse(body);

    const data = await userService.grantUserCredits(params, dto, authItems);
    return NextResponse.json(getResponse(data));
  },
  { authenticate: true },
);
