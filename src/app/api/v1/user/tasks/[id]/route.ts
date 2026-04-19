import taskService from "@/lib/services/user/tasks";
import { userHandler } from "@/lib/utils/handler.utils";
import { getResponse } from "@/lib/utils/response.utils";
import { AppGetRouteContext } from "@/lib/utils/types";
import { taskGetParamsValidator } from "@/lib/validators/user/task.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = userHandler(
  async (req: NextRequest, ctx: AppGetRouteContext, authItems) => {
    const params = taskGetParamsValidator.parse(await ctx.params);

    const data = await taskService.getTask(params, authItems);
    const result = getResponse(data);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
