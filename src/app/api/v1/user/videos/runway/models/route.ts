import videoService from "@/lib/services/user/videos";
import { userHandler } from "@/lib/utils/handler.utils";
import { getResponse } from "@/lib/utils/response.utils";
import { NextResponse } from "next/server";

export const GET = userHandler(async () => {
  const result = videoService.runway.listModels();

  return NextResponse.json(getResponse(result));
});
