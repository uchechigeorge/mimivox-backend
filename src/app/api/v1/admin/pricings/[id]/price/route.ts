import pricingService from "@/lib/services/admin/pricings";
import { adminHandler } from "@/lib/utils/handler.utils";
import { successResponse } from "@/lib/utils/response.utils";
import { AppGetRouteContext } from "@/lib/utils/types";
import {
  pricingUpdateDtoValidator,
  pricingUpdateParamsValidator,
} from "@/lib/validators/admin/pricing.validator";
import { NextResponse } from "next/server";

export const PATCH = adminHandler(
  async (req: Request, ctx: AppGetRouteContext, authItems) => {
    const body = await req.json();

    const params = pricingUpdateParamsValidator.parse(await ctx.params);
    const dto = pricingUpdateDtoValidator.parse(body);

    const result = await pricingService.updatePricing(params.id, dto);
    const response = successResponse(result);
    return NextResponse.json(response);
  },
  { authenticate: true },
);
