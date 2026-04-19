import musicService from "@/lib/services/user/musics";
import { UserAuthItems } from "@/lib/types";
import { userHandler } from "@/lib/utils/handler.utils";
import { successResponse } from "@/lib/utils/response.utils";
import { NextResponse } from "next/server";

export const POST = userHandler(
  async (req: Request, ctx: any, authItems: UserAuthItems) => {
    const body = await req.json();

    const result = await musicService.suno.generateMusicCallBack(body);

    return NextResponse.json(successResponse());
  },
  { authenticate: true },
);
