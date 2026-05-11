import { env } from "@/lib/config/env.config";
import { InternalServerError } from "@/lib/utils/error.util";
import {
  CreatePaystackPlanDto,
  CreatePaystackPlanResponseDto,
  CreatePlanResponse,
} from "./types";
import { PaystackBaseResponse } from "../types";

export const createPlan = async (
  body: CreatePaystackPlanDto,
): Promise<CreatePlanResponse> => {
  const url = `${env.PAYSTACK_API_BASE}/plan`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorResponse = await res.text();
    console.log("Paystack create plan error response:", errorResponse);
    const errorMessage = errorResponse || "Failed to create plan";
    return [null, new InternalServerError(errorMessage)];
  }

  const responseData: PaystackBaseResponse<CreatePaystackPlanResponseDto> =
    await res.json();
  if (!responseData.status) {
    const errorMessage = responseData.message || "Failed to create plan";
    return [null, new InternalServerError(errorMessage)];
  }

  return [responseData.data, null];
};
