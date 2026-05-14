import { userHandler } from "@/lib/utils/handler.utils";
import { generateTextImage } from "@/lib/utils/image.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { AppGetRouteContext } from "@/lib/utils/types";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export const GET = userHandler(
  async (req: NextRequest, ctx: AppGetRouteContext, authItems) => {
    const params = await ctx.params;
    const searchParams = getQueryParams(req);

    const buffer = await generateTextImage(
      params.id,
      searchParams.bg.toString(),
    );

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
      },
    });
  },
);
