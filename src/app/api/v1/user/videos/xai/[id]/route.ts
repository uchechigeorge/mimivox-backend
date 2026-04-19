import videoService from "@/lib/services/user/videos";
import { UserAuthItems } from "@/lib/types";
import { userHandler } from "@/lib/utils/handler.utils";
import { AppGetRouteContext } from "@/lib/utils/types";
import { NextRequest } from "next/server";

export const GET = userHandler(
  async (
    req: NextRequest,
    ctx: AppGetRouteContext,
    authData: UserAuthItems,
  ) => {
    const { id } = await ctx.params;

    const result = await videoService.xai.getVideo(id);

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
