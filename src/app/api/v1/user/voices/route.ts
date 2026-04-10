import voiceService from "@/lib/services/user/voices";
import { UserAuthItems } from "@/lib/types/AuthItems";
import { userHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { getAllResponse } from "@/lib/utils/response.utils";
import { voiceGetAllParamsValidator } from "@/lib/validators/user/voice.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = userHandler(
  async (req: NextRequest, ctx: any, authData: UserAuthItems) => {
    const searchParams = voiceGetAllParamsValidator.parse(getQueryParams(req));

    const [result, meta] = await voiceService.getAllVoices(
      searchParams,
      authData,
    );
    const response = getAllResponse(result, meta);
    return NextResponse.json(response);
  },
  { authenticate: true },
);
