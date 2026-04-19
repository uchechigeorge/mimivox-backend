import videoService from "@/lib/services/user/videos";
import { UserAuthItems } from "@/lib/types";
import { userHandler } from "@/lib/utils/handler.utils";

export const POST = userHandler(
  async (req: Request, ctx: any, authItems: UserAuthItems) => {
    const body = await req.json();

    const result = await videoService.xai.generateVideo(body, authItems);

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
