import musicService from "@/lib/services/user/musics";
import { UserAuthItems } from "@/lib/types";
import { userHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { listResponse } from "@/lib/utils/response.utils";
import { musicListParamsValidator } from "@/lib/validators/user/music.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = userHandler(
  async (req: NextRequest, ctx: any, authItems: UserAuthItems) => {
    const searchParams = getQueryParams(req);

    const params = musicListParamsValidator.parse(searchParams);

    const [data, meta] = await musicService.listMusics(params, authItems);
    const result = listResponse(data, meta);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
