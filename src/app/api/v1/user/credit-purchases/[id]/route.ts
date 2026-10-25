import creditService from "@/lib/services/user/credits";
import { userHandler } from "@/lib/utils/handler.utils";
import { getResponseMeta } from "@/lib/utils/response.utils";
import { AppGetRouteContext } from "@/lib/utils/types";
import { creditPurchaseGetByPaymentTokenParamsValidator } from "@/lib/validators/user/credit.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = userHandler(
  async (req: NextRequest, ctx: AppGetRouteContext, authItems) => {
    const params = creditPurchaseGetByPaymentTokenParamsValidator.parse(
      await ctx.params,
    );

    const [data, meta] = await creditService.getCreditPurchaseByPaymentToken(
      params,
      authItems,
    );
    return NextResponse.json(getResponseMeta(data, meta));
  },
  { authenticate: true },
);
