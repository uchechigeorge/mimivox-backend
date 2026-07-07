import subscriptionService from "@/lib/services/misc/subscriptions";
import { miscHandler } from "@/lib/utils/handler.utils";
import { successResponse } from "@/lib/utils/response.utils";
import { NextResponse } from "next/server";

export const POST = miscHandler(async (req: Request) => {
  const result = await subscriptionService.checkExpiry();
  const response = successResponse(result);
  return NextResponse.json(response);
});
