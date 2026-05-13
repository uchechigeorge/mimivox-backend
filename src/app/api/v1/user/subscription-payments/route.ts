import subscriptionPaymentService from "@/lib/services/user/subscription-payments";
import { userHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { listResponse } from "@/lib/utils/response.utils";
import { subscriptionPaymentListParamsValidator } from "@/lib/validators/user/subscription-payment.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = userHandler(
  async (req: NextRequest, ctx, authItems) => {
    const searchParams = getQueryParams(req);

    const params = subscriptionPaymentListParamsValidator.parse(searchParams);

    const [data, meta] =
      await subscriptionPaymentService.listSubscriptionPayments(
        params,
        authItems,
      );
    const result = listResponse(data, meta);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
