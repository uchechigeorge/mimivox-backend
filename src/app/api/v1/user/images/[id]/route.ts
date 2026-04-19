import imageService from "@/lib/services/user/images";
import { userHandler } from "@/lib/utils/handler.utils";
import { getResponse } from "@/lib/utils/response.utils";
import { AppGetRouteContext } from "@/lib/utils/types";
import { imageGetParamsValidator } from "@/lib/validators/user/image.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = userHandler(
  async (req: NextRequest, ctx: AppGetRouteContext, authItems) => {
    const params = imageGetParamsValidator.parse(await ctx.params);

    const data = await imageService.getImage(params, authItems);
    const result = getResponse(data);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
