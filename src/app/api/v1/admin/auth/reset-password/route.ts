import authService from "@/lib/services/admin/auth";
import { adminHandler } from "@/lib/utils/handler.utils";
import { successResponse } from "@/lib/utils/response.utils";
import { adminResetPasswordValidator } from "@/lib/validators/admin/auth.validator";
import { NextResponse } from "next/server";

export const POST = adminHandler(
  async (req: Request, ctx, authItems) => {
    const body = await req.json();
    const dto = adminResetPasswordValidator.parse(body);

    const result = await authService.resetPassword(dto, authItems);
    const response = successResponse(result);
    return NextResponse.json(response);
  },
  { authenticate: true },
);
