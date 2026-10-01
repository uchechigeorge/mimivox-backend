import imageService from "@/lib/services/user/images";
import { UserAuthItems } from "@/lib/types";
import { userHandler } from "@/lib/utils/handler.utils";
import { successResponse } from "@/lib/utils/response.utils";
import { NextResponse } from "next/server";

export const POST = userHandler(
  async (req: Request, ctx: unknown, authItems: UserAuthItems) => {
    const body = await req.json();

    const result = await imageService.runway.generateImage(body, authItems);

    return NextResponse.json(successResponse(result));
  },
  { authenticate: true },
);
