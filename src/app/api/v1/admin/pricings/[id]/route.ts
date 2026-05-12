import pricingService from "@/lib/services/admin/pricings";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getResponse } from "@/lib/utils/response.utils";
import { AppGetRouteContext } from "@/lib/utils/types";
import { pricingGetParamsValidator } from "@/lib/validators/admin/pricing.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(
  async (req: NextRequest, ctx: AppGetRouteContext, authItems) => {
    const params = pricingGetParamsValidator.parse(await ctx.params);

    const data = await pricingService.getPricing(params, authItems);
    const result = getResponse(data);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
