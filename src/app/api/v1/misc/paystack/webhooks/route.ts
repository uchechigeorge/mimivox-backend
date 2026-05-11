import paystackService from "@/lib/services/misc/paystack";
import { userHandler } from "@/lib/utils/handler.utils";
import { successResponse } from "@/lib/utils/response.utils";
import {
  getHeaders,
  handlePaystackWebhookDto,
} from "@/lib/validators/misc/paystack.validator";
import { NextResponse } from "next/server";

export const POST = userHandler(async (req: Request) => {
  const headers = await getHeaders(req);
  const body = await req.json();
  const dto = handlePaystackWebhookDto.parse(body);

  const result = await paystackService.handleWebhook(dto, headers);
  const response = successResponse(result);
  return NextResponse.json(response);
});
