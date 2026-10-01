import imageService from "@/lib/services/user/images";
import { miscHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { getResponse } from "@/lib/utils/response.utils";
import { NextResponse } from "next/server";

export const GET = miscHandler(async (req) => {
  const searchParams = getQueryParams(req);
  const maxTasksToProcess = Number(searchParams.maxTasksToProcess) || undefined;

  const result = await imageService.runway.processImageStatus({
    maxTasksToProcess,
  });

  return NextResponse.json(getResponse(result));
});
