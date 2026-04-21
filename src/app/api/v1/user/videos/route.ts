import videoService from "@/lib/services/user/videos";
import { userHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { listResponse } from "@/lib/utils/response.utils";
import { videoListParamsValidator } from "@/lib/validators/user/video.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = userHandler(
  async (req: NextRequest, ctx: any, authItems) => {
    const searchParams = getQueryParams(req);

    const params = videoListParamsValidator.parse(searchParams);

    const [data, meta] = await videoService.listVideos(params, authItems);
    const result = listResponse(data, meta);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
