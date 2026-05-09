import authService from "@/lib/services/user/auth";
import { userHandler } from "@/lib/utils/handler.utils";
import { successResponse } from "@/lib/utils/response.utils";
import { NextResponse } from "next/server";

export const POST = userHandler(
  async (req: Request, ctx, authItems) => {
    const result = await authService.verifyEmail.sendEmail(authItems);
    const response = successResponse(result);
    return NextResponse.json(response);
  },
  { authenticate: true },
);
