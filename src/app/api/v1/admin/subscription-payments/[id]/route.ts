import subscriptionPaymentService from "@/lib/services/admin/subscription-payments";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getResponse } from "@/lib/utils/response.utils";
import { AppGetRouteContext } from "@/lib/utils/types";
import { subscriptionPaymentGetParamsValidator } from "@/lib/validators/admin/subscription-payment.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(
  async (req: NextRequest, ctx: AppGetRouteContext, authItems) => {
    const params = subscriptionPaymentGetParamsValidator.parse(
      await ctx.params,
    );

    const data =
      await subscriptionPaymentService.getSubscriptionPayment(params);
    const result = getResponse(data);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
