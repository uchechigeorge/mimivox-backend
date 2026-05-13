import subscriptionPaymentService from "@/lib/services/admin/subscription-payments";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { listResponse } from "@/lib/utils/response.utils";
import { subscriptionPaymentListParamsValidator } from "@/lib/validators/admin/subscription-payment.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(
  async (req: NextRequest) => {
    const searchParams = getQueryParams(req);

    const params = subscriptionPaymentListParamsValidator.parse(searchParams);

    const [data, meta] =
      await subscriptionPaymentService.listSubscriptionPayments(params);
    const result = listResponse(data, meta);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
