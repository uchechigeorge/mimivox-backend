import subscriptionService from "@/lib/services/admin/subscriptions";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { listResponse } from "@/lib/utils/response.utils";
import { subscriptionListParamsValidator } from "@/lib/validators/admin/subscription.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(
  async (req: NextRequest) => {
    const searchParams = getQueryParams(req);

    const params = subscriptionListParamsValidator.parse(searchParams);

    const [data, meta] = await subscriptionService.listSubscriptions(params);
    const result = listResponse(data, meta);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
