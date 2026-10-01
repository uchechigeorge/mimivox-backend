import videoService from "@/lib/services/user/videos";
import { UserAuthItems } from "@/lib/types";
import { userHandler } from "@/lib/utils/handler.utils";
import { getResponse } from "@/lib/utils/response.utils";
import { AppGetRouteContext } from "@/lib/utils/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = userHandler(
  async (
    req: NextRequest,
    ctx: AppGetRouteContext,
    authItems: UserAuthItems,
  ) => {
    const { id } = await ctx.params;

    const result = await videoService.runway.getVideo(id, authItems);

    return NextResponse.json(getResponse(result));
  },
  { authenticate: true },
);
