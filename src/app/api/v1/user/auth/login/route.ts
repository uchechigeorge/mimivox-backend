import authService from "@/lib/services/user/auth";
import { userHandler } from "@/lib/utils/handler.utils";
import { successResponse } from "@/lib/utils/response";
import { loginValidator } from "@/lib/validators/user/auth.validator";
import { NextResponse } from "next/server";

export const POST = userHandler(async (req: Request) => {
  const body = await req.json();
  const dto = loginValidator.parse(body);

  const result = await authService.login(dto);
  const response = successResponse(result);
  return NextResponse.json(response);
});
