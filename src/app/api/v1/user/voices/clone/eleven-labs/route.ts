import voiceService from "@/lib/services/user/voices";
import { UserAuthItems } from "@/lib/types";
import { userHandler } from "@/lib/utils/handler.utils";
import { AppRouteContext } from "@/lib/utils/types";

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
