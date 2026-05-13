import transactionService from "@/lib/services/admin/transactions";
import { adminHandler } from "@/lib/utils/handler.utils";
import { getQueryParams } from "@/lib/utils/request.utils";
import { listResponse } from "@/lib/utils/response.utils";
import { transactionListParamsValidator } from "@/lib/validators/admin/transaction.validator";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminHandler(
  async (req: NextRequest) => {
    const searchParams = getQueryParams(req);

    const params = transactionListParamsValidator.parse(searchParams);

    const [data, meta] = await transactionService.listTransactions(params);
    const result = listResponse(data, meta);
    return NextResponse.json(result);
  },
  { authenticate: true },
);
