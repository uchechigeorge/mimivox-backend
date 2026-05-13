import dashboardService from "@/lib/services/admin/dashboard";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { getResponse } from "@/lib/utils/response.utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(
  async (req: NextRequest, ctx: any, authItems) => {
    const response = await dashboardService.getDashboardDetails();
    const result = getResponse(response);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
