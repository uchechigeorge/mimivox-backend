import subscriptionService from "@/lib/services/user/subscriptions";
import { userHandler } from "@/lib/utils/handler.utils";
import { okResponse } from "@/lib/utils/response.utils";
import { NextRequest, NextResponse } from "next/server";

export const POST = userHandler(
  async (req: NextRequest, ctx, authItems) => {
    await subscriptionService.cancelSubscription(authItems);
    const result = okResponse();
    return NextResponse.json(result);
  },
  { authenticate: true },
);
