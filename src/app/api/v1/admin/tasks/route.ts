import taskService from "@/lib/services/admin/tasks";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { listResponse } from "@/lib/utils/response.utils";
import { taskListParamsValidator } from "@/lib/validators/admin/task.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(
  async (req: NextRequest, ctx, authItems) => {
    const searchParams = getQueryParams(req);

    const params = taskListParamsValidator.parse(searchParams);

    const [data, meta] = await taskService.listTasks(params, authItems);
    const result = listResponse(data, meta);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
