import pricingSettingsService from "@/lib/services/admin/pricing-settings";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { listResponse } from "@/lib/utils/response.utils";
import { pricingSettingListParamsValidator } from "@/lib/validators/admin/pricing-setting.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(
  async (req: NextRequest) => {
    const searchParams = getQueryParams(req);

    const params = pricingSettingListParamsValidator.parse(searchParams);

    const [data, meta] = await pricingSettingsService.listPricingSettings(
      params,
    );
    const result = listResponse(data, meta);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
