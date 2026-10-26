import creditService from "@/lib/services/user/credits";
import { userHandler } from "@/lib/utils/handler.utils";
import { getResponse } from "@/lib/utils/response.utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = userHandler(
  async (req: NextRequest, ctx, authItems) => {
    const data = await creditService.listCreditGrants(authItems);
    return NextResponse.json(getResponse(data));
  },
  { authenticate: true },
);
