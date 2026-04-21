import audioService from "@/lib/services/admin/audios";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { listResponse } from "@/lib/utils/response.utils";
import { audioListParamsValidator } from "@/lib/validators/admin/audio.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(
  async (req: NextRequest, ctx: any, authData) => {
    const searchParams = audioListParamsValidator.parse(getQueryParams(req));

    const [result, meta] = await audioService.listAudios(
      searchParams,
      authData,
    );
    const response = listResponse(result, meta);
    return NextResponse.json(response);
  },
  { authenticate: true },
);
