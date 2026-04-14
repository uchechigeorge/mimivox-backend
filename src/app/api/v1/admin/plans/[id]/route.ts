import planService from "@/lib/services/admin/plans";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getResponse } from "@/lib/utils/response.utils";
import { AppGetRouteContext } from "@/lib/utils/types";
import { planGetParamsValidator } from "@/lib/validators/admin/plan.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(
  async (req: NextRequest, ctx: AppGetRouteContext, authItems) => {
    const params = planGetParamsValidator.parse(await ctx.params);

    const data = await planService.getPlan(params, authItems);
    const result = getResponse(data);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
