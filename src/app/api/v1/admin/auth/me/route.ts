import authService from "@/lib/services/admin/auth";
import { AdminAuthItems } from "@/lib/types/AuthItems";
import { adminHandler } from "@/lib/utils/handler.utils";
import { successResponse } from "@/lib/utils/response.utils";
import { NextResponse } from "next/server";

export const GET = adminHandler(
  async (req: Request, ctx: any, authData: AdminAuthItems) => {
    const result = await authService.getAuthenticatedAdmin(authData);
    const response = successResponse(result);
    return NextResponse.json(response);
  },
  { authenticate: true },
);
