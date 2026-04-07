import userService from "@/lib/services/admin/users";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { getAllResponse } from "@/lib/utils/response.utils";
import { userGetAllParamsValidator } from "@/lib/validators/admin/user.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(async (req: NextRequest) => {
  const searchParams = getQueryParams(req);

  const params = userGetAllParamsValidator.parse(searchParams);

  const [data, meta] = await userService.getAllUsers(params);
  const result = getAllResponse(data, meta);
  return NextResponse.json(result);
});
