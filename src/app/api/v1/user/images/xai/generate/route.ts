import imageService from "@/lib/services/user/images";
import { UserAuthItems } from "@/lib/types";
import { userHandler } from "@/lib/utils/handler.utils";

export const POST = userHandler(
  async (req: Request, ctx: any, authItems: UserAuthItems) => {
    const body = await req.json();

    const result = await imageService.xai.generateImage(body, authItems);

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

// export const GET = userHandler(
//   async (req: NextRequest, ctx: any, authData: UserAuthItems) => {
//     const searchParams = getSearchParams(req);

//     const result = await voiceService.list.listElevenLabsVoices(
//       searchParams,
//       authData,
//     );

//     const headers = new Headers(result.headers);

//     // header cleanup
//     headers.delete("content-encoding");
//     headers.delete("transfer-encoding");

//     return new Response(result.body, {
//       status: result.status,
//       headers,
//     });
//   },
//   { authenticate: true },
// );
