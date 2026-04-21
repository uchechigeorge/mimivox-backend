import musicService from "@/lib/services/admin/musics";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { listResponse } from "@/lib/utils/response.utils";
import { musicListParamsValidator } from "@/lib/validators/admin/music.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(
  async (req: NextRequest, ctx: any, authItems) => {
    const searchParams = getQueryParams(req);

    const params = musicListParamsValidator.parse(searchParams);

    const [data, meta] = await musicService.listMusics(params, authItems);
    const result = listResponse(data, meta);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
