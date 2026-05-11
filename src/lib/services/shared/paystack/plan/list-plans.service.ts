import { env } from "@/lib/config/env.config";
import {
  GetPaystackPlanParams,
  ListPlanResponse,
  ReadPaystackPlanDto,
} from "./types";
import { InternalServerError } from "@/lib/utils/error.util";
import { PaystackBaseResponse } from "../types";

export const listPlans = async (
  params: GetPaystackPlanParams,
): Promise<ListPlanResponse> => {
  const url = `${env.PAYSTACK_API_BASE}/plan?${new URLSearchParams(
    params as Record<string, string>,
  )}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
    },
  });

  if (!res.ok) {
    const errorResponse = await res.json();
    const errorMessage = errorResponse.message || "Failed to create plan";
    return [null, new InternalServerError(errorMessage)];
  }

  const responseData: PaystackBaseResponse<ReadPaystackPlanDto[]> =
    await res.json();
  if (!responseData.status) {
    const errorMessage = responseData.message || "Failed to create plan";
    return [null, new InternalServerError(errorMessage)];
  }

  return [responseData.data, null];
};
