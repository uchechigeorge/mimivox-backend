import transactionService from "@/lib/services/admin/transactions";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getResponse } from "@/lib/utils/response.utils";
import { AppGetRouteContext } from "@/lib/utils/types";
import { transactionGetParamsValidator } from "@/lib/validators/admin/transaction.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(
  async (req: NextRequest, ctx: AppGetRouteContext, authItems) => {
    const params = transactionGetParamsValidator.parse(await ctx.params);

    const data = await transactionService.getTransaction(params);
    const result = getResponse(data);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
