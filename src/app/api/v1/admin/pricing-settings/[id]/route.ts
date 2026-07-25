import pricingSettingsService from "@/lib/services/admin/pricing-settings";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getResponse } from "@/lib/utils/response.utils";
import { AppGetRouteContext } from "@/lib/utils/types";
import {
  pricingSettingGetParamsValidator,
  pricingSettingUpdateParamsValidator,
  pricingSettingUpdateDtoValidator,
} from "@/lib/validators/admin/pricing-setting.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(
  async (req: NextRequest, ctx: AppGetRouteContext, authItems) => {
    const params = pricingSettingGetParamsValidator.parse(await ctx.params);

    const data = await pricingSettingsService.getPricingSetting(params, authItems);
    const result = getResponse(data);
    return NextResponse.json(result);
  },
  { authenticate: true },
);

export const PATCH = adminHandler(
  async (req: NextRequest, ctx: AppGetRouteContext, authItems) => {
    const params = pricingSettingUpdateParamsValidator.parse(await ctx.params);
    const body = await req.json();
    const updateDto = pricingSettingUpdateDtoValidator.parse(body);

    const data = await pricingSettingsService.updatePricingSetting(
      params.id,
      updateDto,
    );
    const result = getResponse(data);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
