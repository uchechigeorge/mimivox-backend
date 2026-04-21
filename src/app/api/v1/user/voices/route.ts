import voiceService from "@/lib/services/user/voices";
import { userHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { listResponse } from "@/lib/utils/response.utils";
import { voiceListParamsValidator } from "@/lib/validators/user/voice.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = userHandler(
  async (req: NextRequest, ctx: any, authData) => {
    const searchParams = voiceListParamsValidator.parse(getQueryParams(req));

    const [result, meta] = await voiceService.listVoices(
      searchParams,
      authData,
    );
    const response = listResponse(result, meta);
    return NextResponse.json(response);
  },
  { authenticate: true },
);
