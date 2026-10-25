import creditService from "@/lib/services/user/credits";
import { userHandler } from "@/lib/utils/handler.utils";
import { createdResponseMeta, getResponse } from "@/lib/utils/response.utils";
import { creditPurchaseCreateValidator } from "@/lib/validators/user/credit.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = userHandler(
  async (req: NextRequest, ctx, authItems) => {
    const data = await creditService.listCreditPurchases(authItems);
    return NextResponse.json(getResponse(data));
  },
  { authenticate: true },
);

export const POST = userHandler(
  async (req: NextRequest, ctx, authItems) => {
    const body = await req.json();
    const dto = creditPurchaseCreateValidator.parse(body);

    const [data, meta] = await creditService.createCreditPurchase(
      dto,
      authItems,
    );
    return NextResponse.json(createdResponseMeta(data, meta));
  },
  { authenticate: true },
);
