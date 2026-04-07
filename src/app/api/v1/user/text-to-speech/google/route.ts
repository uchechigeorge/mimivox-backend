import textToSpeechService from "@/lib/services/user/audios/text-to-speech";
import { UserAuthItems } from "@/lib/types";
import { userHandler } from "@/lib/utils/handler.utils";
import { AppRouteContext } from "@/lib/utils/types";

export const POST = userHandler(
  async (req: Request, ctx: AppRouteContext<any>, authItems: UserAuthItems) => {
    const body = await req.json();

    const result = await textToSpeechService.generateViaGoogle(body, authItems);

    const headers = new Headers(result.headers);

    // optional cleanup
    headers.delete("content-encoding");
    headers.delete("transfer-encoding");

    return new Response(result.body, {
      status: result.status,
      headers,
    });
  },
);
