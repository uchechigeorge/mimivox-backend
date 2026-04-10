import audioService from "@/lib/services/user/audios";
import { UserAuthItems } from "@/lib/types/AuthItems";
import { userHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { getAllResponse } from "@/lib/utils/response.utils";
import { audioGetAllParamsValidator } from "@/lib/validators/user/audio.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = userHandler(
  async (req: NextRequest, ctx: any, authData: UserAuthItems) => {
    const searchParams = audioGetAllParamsValidator.parse(getQueryParams(req));

    const [result, meta] = await audioService.getAllAudios(
      searchParams,
      authData,
    );
    const response = getAllResponse(result, meta);
    return NextResponse.json(response);
  },
  { authenticate: true },
);
