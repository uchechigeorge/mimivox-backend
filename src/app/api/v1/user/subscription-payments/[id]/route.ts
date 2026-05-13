import subscriptionPaymentService from "@/lib/services/user/subscription-payments";
import { userHandler } from "@/lib/utils/handler.utils";
import { getResponse } from "@/lib/utils/response.utils";
import { AppGetRouteContext } from "@/lib/utils/types";
import { subscriptionPaymentGetParamsValidator } from "@/lib/validators/user/subscription-payment.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = userHandler(
  async (req: NextRequest, ctx: AppGetRouteContext, authItems) => {
    const params = subscriptionPaymentGetParamsValidator.parse(
      await ctx.params,
    );

    const data = await subscriptionPaymentService.getSubscriptionPayment(
      params,
      authItems,
    );
    const result = getResponse(data);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
