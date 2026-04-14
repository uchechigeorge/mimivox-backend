import planService from "@/lib/services/user/plans";
import { userHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { listResponse } from "@/lib/utils/response.utils";
import { planListParamsValidator } from "@/lib/validators/user/plan.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = userHandler(
  async (req: NextRequest) => {
    const searchParams = getQueryParams(req);

    const params = planListParamsValidator.parse(searchParams);

    const [data, meta] = await planService.listPlans(params);
    const result = listResponse(data, meta);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
