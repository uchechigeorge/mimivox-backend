import adminService from "@/lib/services/admin/admins";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { createdResponseMeta, listResponse } from "@/lib/utils/response.utils";
import {
  adminCreateDtoValidator,
  adminListParamsValidator,
} from "@/lib/validators/admin/admin.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(
  async (req: NextRequest) => {
    const searchParams = getQueryParams(req);

    const params = adminListParamsValidator.parse(searchParams);

    const [data, meta] = await adminService.listAdmins(params);
    const result = listResponse(data, meta);
    return NextResponse.json(result);
  },
  { authenticate: true },
);

export const POST = adminHandler(
  async (req: NextRequest) => {
    const body = await req.json();
    const dto = adminCreateDtoValidator.parse(body);

    const [data, meta] = await adminService.createAdmin(dto);
    const result = createdResponseMeta(data, meta);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
