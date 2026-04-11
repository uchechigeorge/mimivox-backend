import voiceService from "@/lib/services/user/voices";
import { UserAuthItems } from "@/lib/types";
import { userHandler } from "@/lib/utils/handler.utils";
import { NextRequest } from "next/server";

export const GET = userHandler(
  async (req: NextRequest, ctx: any, authData: UserAuthItems) => {
    const result = await voiceService.list.listGoogleVoices(authData);

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
