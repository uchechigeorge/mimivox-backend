import audioService from "@/lib/services/user/audios";
import { UserAuthItems } from "@/lib/types/AuthItems";
import { userHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { listResponse } from "@/lib/utils/response.utils";
import { audioListParamsValidator } from "@/lib/validators/user/audio.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = userHandler(
  async (req: NextRequest, ctx: any, authData: UserAuthItems) => {
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
