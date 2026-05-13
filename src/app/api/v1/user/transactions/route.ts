import transactionService from "@/lib/services/user/transactions";
import { userHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { listResponse } from "@/lib/utils/response.utils";
import { transactionListParamsValidator } from "@/lib/validators/user/transaction.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = userHandler(
  async (req: NextRequest, ctx, authItems) => {
    const searchParams = getQueryParams(req);

    const params = transactionListParamsValidator.parse(searchParams);

    const [data, meta] = await transactionService.listTransactions(
      params,
      authItems,
    );
    const result = listResponse(data, meta);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
