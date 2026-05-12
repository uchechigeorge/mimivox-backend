import subscriptionService from "@/lib/services/user/subscriptions";
import { userHandler } from "@/lib/utils/handler.utils";
import { getResponseMeta } from "@/lib/utils/response.utils";
import { AppGetRouteContext } from "@/lib/utils/types";
import { subscriptionGetByPaymentTokenParamsValidator } from "@/lib/validators/user/subscription.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = userHandler(
  async (req: NextRequest, ctx: AppGetRouteContext, authItems) => {
    const params = subscriptionGetByPaymentTokenParamsValidator.parse(
      await ctx.params,
    );

    const [data, meta] =
      await subscriptionService.getSubscriptionByPaymentToken(
        params,
        authItems,
      );
    const result = getResponseMeta(data, meta);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
