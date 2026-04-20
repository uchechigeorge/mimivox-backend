import voiceService from "@/lib/services/user/voices";
import { UserAuthItems } from "@/lib/types";
import { userHandler } from "@/lib/utils/handler.utils";
import { getQueryParams as getSearchParams } from "@/lib/utils/request.utils";
import { AppRouteContext } from "@/lib/utils/types";
import { NextRequest } from "next/server";

export const POST = userHandler(
  async (req: Request, ctx: AppRouteContext<any>, authItems: UserAuthItems) => {
    const formData = await req.formData();

    const result = await voiceService.clone.cloneViaElevenLabs(
      formData,
      authItems,
    );

    const headers = new Headers(result.headers);

    // header cleanup
    headers.delete("content-encoding");
    headers.delete("transfer-encoding");

    return new Response(result.body, {
      status: result.status,
      headers,
    });
  },
  { authenticate: true },
);

export const GET = userHandler(
  async (req: NextRequest, ctx: any, authData: UserAuthItems) => {
    const searchParams = getSearchParams(req);

    const result = await voiceService.list.listElevenLabsVoices(
      searchParams,
      authData,
    );

    const headers = new Headers(result.headers);

    // header cleanup
    headers.delete("content-encoding");
    headers.delete("transfer-encoding");

    return new Response(result.body, {
      status: result.status,
      headers,
    });
  },
  { authenticate: true },
);
