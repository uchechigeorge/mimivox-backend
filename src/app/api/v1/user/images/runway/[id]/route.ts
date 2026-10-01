import imageService from "@/lib/services/user/images";
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

    const result = await imageService.runway.getImage(id, authItems);

    return NextResponse.json(getResponse(result));
  },
  { authenticate: true },
);
