import authService from "@/lib/services/user/auth";
import { userHandler } from "@/lib/utils/handler.utils";
import { successResponse } from "@/lib/utils/response.utils";
import { forgotPasswordSendEmailValidator } from "@/lib/validators/user/auth.validator";
import { NextResponse } from "next/server";

export const POST = userHandler(async (req: Request, ctx, authItems) => {
  const body = await req.json();
  const dto = forgotPasswordSendEmailValidator.parse(body);

  const result = await authService.forgotPassword.sendEmail(dto);
  const response = successResponse(result);
  return NextResponse.json(response);
});
