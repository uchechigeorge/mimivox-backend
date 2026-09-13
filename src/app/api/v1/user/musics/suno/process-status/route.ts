import musicService from "@/lib/services/user/musics";
import { miscHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { getResponse } from "@/lib/utils/response.utils";
import { NextResponse } from "next/server";

export const GET = miscHandler(async (req, ctx) => {
  const searchParams = getQueryParams(req);

  const params: { ignoreReversal?: boolean } = {
    ignoreReversal: searchParams.ignoreReversal === "true" ? true : false,
  };
  const result = await musicService.suno.processMusicStatus(params);

  return NextResponse.json(getResponse(result));
});
