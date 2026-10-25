import creditService from "@/lib/services/admin/credits";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { createdResponse, getResponse } from "@/lib/utils/response.utils";
import {
  creditPackageCreateDtoValidator,
  creditPackageListParamsValidator,
} from "@/lib/validators/admin/credit.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(
  async (req: NextRequest) => {
    const params = creditPackageListParamsValidator.parse(getQueryParams(req));

    const data = await creditService.listCreditPackages(params);
    return NextResponse.json(getResponse(data));
  },
  { authenticate: true },
);

export const POST = adminHandler(
  async (req: NextRequest) => {
    const dto = creditPackageCreateDtoValidator.parse(await req.json());

    const data = await creditService.createCreditPackage(dto);
    return NextResponse.json(createdResponse(data));
  },
  { authenticate: true },
);
