import pricingService from "@/lib/services/admin/pricings";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { listResponse } from "@/lib/utils/response.utils";
import { pricingListParamsValidator } from "@/lib/validators/admin/pricing.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(
  async (req: NextRequest) => {
    const searchParams = getQueryParams(req);

    const params = pricingListParamsValidator.parse(searchParams);

    const [data, meta] = await pricingService.listPricings(params);
    const result = listResponse(data, meta);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
