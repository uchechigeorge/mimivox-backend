import authService from "@/lib/services/admin/auth";
import { adminHandler } from "@/lib/utils/handler.utils";
import { successResponse } from "@/lib/utils/response.utils";
import { adminLoginValidator } from "@/lib/validators/admin/auth.validator";
import { NextResponse } from "next/server";

export const POST = adminHandler(async (req: Request) => {
  const body = await req.json();
  const dto = adminLoginValidator.parse(body);

  const result = await authService.login(dto);
  const response = successResponse(result);
  return NextResponse.json(response);
});
