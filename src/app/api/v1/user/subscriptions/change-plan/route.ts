import subscriptionService from "@/lib/services/user/subscriptions";
import { userHandler } from "@/lib/utils/handler.utils";
import { createdResponseMeta } from "@/lib/utils/response.utils";
import { subscriptionChangePlanValidator } from "@/lib/validators/user/subscription.validator";
import { NextRequest, NextResponse } from "next/server";

export const POST = userHandler(
  async (req: NextRequest, ctx, authItems) => {
    const body = await req.json();
    const dto = subscriptionChangePlanValidator.parse(body);

    const [data, meta] = await subscriptionService.changePlan(dto, authItems);
    const result = createdResponseMeta(data, meta);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
