import musicService from "@/lib/services/user/musics";
import { userHandler } from "@/lib/utils/handler.utils";
import { getResponse } from "@/lib/utils/response.utils";
import { AppGetRouteContext } from "@/lib/utils/types";
import { musicGetParamsValidator } from "@/lib/validators/user/music.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = userHandler(
  async (req: NextRequest, ctx: AppGetRouteContext, authItems) => {
    const params = musicGetParamsValidator.parse(await ctx.params);

    const data = await musicService.getMusic(params, authItems);
    const result = getResponse(data);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
