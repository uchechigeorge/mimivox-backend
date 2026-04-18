import subscriptionService from "@/lib/services/admin/subscriptions";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getResponse } from "@/lib/utils/response.utils";
import { AppGetRouteContext } from "@/lib/utils/types";
import { subscriptionExtendParamsValidator } from "@/lib/validators/admin/subscription.validator";
import { NextRequest, NextResponse } from "next/server";

export const POST = adminHandler(
  async (req: NextRequest, ctx: AppGetRouteContext, authItems) => {
    const params = subscriptionExtendParamsValidator.parse(await ctx.params);

    const data = await subscriptionService.extendSubscription(params);
    const result = getResponse(data);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
