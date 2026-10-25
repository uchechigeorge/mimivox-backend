import creditService from "@/lib/services/admin/credits";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getResponse, okResponse } from "@/lib/utils/response.utils";
import { AppGetRouteContext } from "@/lib/utils/types";
import {
  creditPackageGetParamsValidator,
  creditPackageUpdateDtoValidator,
} from "@/lib/validators/admin/credit.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(
  async (req: NextRequest, ctx: AppGetRouteContext) => {
    const params = creditPackageGetParamsValidator.parse(await ctx.params);

    const data = await creditService.getCreditPackage(params.id);
    return NextResponse.json(getResponse(data));
  },
  { authenticate: true },
);

export const PATCH = adminHandler(
  async (req: NextRequest, ctx: AppGetRouteContext) => {
    const params = creditPackageGetParamsValidator.parse(await ctx.params);
    const dto = creditPackageUpdateDtoValidator.parse(await req.json());

    const data = await creditService.updateCreditPackage(params.id, dto);
    return NextResponse.json(getResponse(data));
  },
  { authenticate: true },
);

export const DELETE = adminHandler(
  async (req: NextRequest, ctx: AppGetRouteContext) => {
    const params = creditPackageGetParamsValidator.parse(await ctx.params);

    await creditService.deleteCreditPackage(params.id);
    return NextResponse.json(okResponse());
  },
  { authenticate: true },
);
