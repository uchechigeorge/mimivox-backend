import creditService from "@/lib/services/user/credits";
import { userHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { getResponse } from "@/lib/utils/response.utils";
import { creditPackageListParamsValidator } from "@/lib/validators/user/credit.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = userHandler(
  async (req: NextRequest) => {
    const params = creditPackageListParamsValidator.parse(getQueryParams(req));

    const data = await creditService.listCreditPackages(params);
    return NextResponse.json(getResponse(data));
  },
  { authenticate: true },
);
