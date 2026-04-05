import authService from "@/lib/services/user/auth";
import { UserAuthItems } from "@/lib/types/AuthItems";
import { userHandler } from "@/lib/utils/handler";
import { successResponse } from "@/lib/utils/response";
import { NextResponse } from "next/server";

export const GET = userHandler(
  async (req: Request, ctx: any, authData: UserAuthItems) => {
    const result = await authService.getAuthenticatedUser(authData);
    const response = successResponse(result);
    return NextResponse.json(response);
  },
  { authenticate: true },
);
