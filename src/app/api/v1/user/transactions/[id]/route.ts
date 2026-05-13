import transactionService from "@/lib/services/user/transactions";
import { userHandler } from "@/lib/utils/handler.utils";
import { getResponse } from "@/lib/utils/response.utils";
import { AppGetRouteContext } from "@/lib/utils/types";
import { transactionGetParamsValidator } from "@/lib/validators/user/transaction.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = userHandler(
  async (req: NextRequest, ctx: AppGetRouteContext, authItems) => {
    const params = transactionGetParamsValidator.parse(await ctx.params);

    const data = await transactionService.getTransaction(params, authItems);
    const result = getResponse(data);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
