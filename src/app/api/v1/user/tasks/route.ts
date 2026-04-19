import taskService from "@/lib/services/user/tasks";
import { userHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { listResponse } from "@/lib/utils/response.utils";
import { taskListParamsValidator } from "@/lib/validators/user/task.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = userHandler(
  async (req: NextRequest) => {
    const searchParams = getQueryParams(req);

    const params = taskListParamsValidator.parse(searchParams);

    const [data, meta] = await taskService.listTasks(params);
    const result = listResponse(data, meta);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
