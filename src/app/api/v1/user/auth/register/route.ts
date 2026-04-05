import authService from "@/lib/services/user/auth";
import { userHandler } from "@/lib/utils/handler";
import { successResponse } from "@/lib/utils/response";
import { registerValidator } from "@/lib/validators/user/auth.validator";
import { NextResponse } from "next/server";

export const POST = userHandler(async (req: Request) => {
  const body = await req.json();
  const dto = registerValidator.parse(body);

  const result = await authService.register(dto);
  const response = successResponse(result);
  return NextResponse.json(response);
});
