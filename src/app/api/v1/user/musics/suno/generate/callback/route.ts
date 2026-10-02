import musicService from "@/lib/services/user/musics";
import { miscHandler } from "@/lib/utils/handler.utils";
import { successResponse } from "@/lib/utils/response.utils";
import { NextResponse } from "next/server";

// Called by Suno's servers, so there is no user token. The body is not
// trusted: the service checks the task's status with Suno itself.
export const POST = miscHandler(async (req: Request) => {
  const body = await req.json();

  await musicService.suno.generateMusicCallBack(body);

  return NextResponse.json(successResponse());
});
