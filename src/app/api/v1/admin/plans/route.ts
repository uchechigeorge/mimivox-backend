import planService from "@/lib/services/admin/plans";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { listResponse } from "@/lib/utils/response.utils";
import { planListParamsValidator } from "@/lib/validators/admin/plan.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(
  async (req: NextRequest) => {
    const searchParams = getQueryParams(req);

    const params = planListParamsValidator.parse(searchParams);

    const [data, meta] = await planService.listPlans(params);
    const result = listResponse(data, meta);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
