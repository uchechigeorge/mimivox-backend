import creditService from "@/lib/services/admin/credits";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { getResponse } from "@/lib/utils/response.utils";
import { creditPackageListParamsValidator } from "@/lib/validators/admin/credit.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(
  async (req: NextRequest) => {
    const params = creditPackageListParamsValidator.parse(getQueryParams(req));

    const data = await creditService.listCreditPurchases(params);
    return NextResponse.json(getResponse(data));
  },
  { authenticate: true },
);
