import subscriptionService from "@/lib/services/admin/subscriptions";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getResponse } from "@/lib/utils/response.utils";
import { AppGetRouteContext } from "@/lib/utils/types";
import { subscriptionGetParamsValidator } from "@/lib/validators/admin/subscription.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(
  async (req: NextRequest, ctx: AppGetRouteContext, authItems) => {
    const params = subscriptionGetParamsValidator.parse(await ctx.params);

    const data = await subscriptionService.getSubscription(params);
    const result = getResponse(data);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
