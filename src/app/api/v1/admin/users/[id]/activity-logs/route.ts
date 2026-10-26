import { ListUserActivityLogsParams } from "@/lib/dtos/admin/user.dto";
import userService from "@/lib/services/admin/users";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { listResponse } from "@/lib/utils/response.utils";
import { AppRouteContext } from "@/lib/utils/types";
import { listUserActivityLogsParamsValidator } from "@/lib/validators/admin/user.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(
  async (
    req: NextRequest,
    ctx: AppRouteContext<ListUserActivityLogsParams>,
  ) => {
    const params = listUserActivityLogsParamsValidator.parse({
      ...getQueryParams(req),
      ...(await ctx.params),
    });

    const [data, meta] = await userService.listUserActivityLogs(params);
    return NextResponse.json(listResponse(data, meta));
  },
  { authenticate: true },
);
