import musicService from "@/lib/services/user/musics";
import { UserAuthItems } from "@/lib/types";
import { userHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { AppGetRouteContext } from "@/lib/utils/types";
import { sunoMusicGetQueryValidator } from "@/lib/validators/user/music.validator";
import { NextRequest } from "next/server";

export const GET = userHandler(
  async (
    req: NextRequest,
    ctx: AppGetRouteContext,
    authData: UserAuthItems,
  ) => {
    const { id } = await ctx.params;
    const searchParams = getQueryParams(req);
    const params = sunoMusicGetQueryValidator.parse(searchParams);

    const result = await musicService.suno.getMusic({
      taskId: id,
      ...params,
    });

    const headers = new Headers(result.headers);

    // header cleanup
    headers.delete("content-encoding");
    headers.delete("transfer-encoding");

    return new Response(result.body, {
      status: result.status,
      headers,
    });
  },
  { authenticate: true },
);
