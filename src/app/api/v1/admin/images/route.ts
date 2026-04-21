import imageService from "@/lib/services/admin/images";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { listResponse } from "@/lib/utils/response.utils";
import { imageListParamsValidator } from "@/lib/validators/admin/image.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(
  async (req: NextRequest, ctx: any, authItems) => {
    const searchParams = getQueryParams(req);

    const params = imageListParamsValidator.parse(searchParams);

    const [data, meta] = await imageService.listImages(params, authItems);
    const result = listResponse(data, meta);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
