import { env } from "@/lib/config/env.config";
import { PaystackServiceError } from "@/lib/utils/error.util";
import { UpdatePaystackPlanDto, UpdatePlanResponse } from "./types";
import { PaystackGeneralResponse } from "../types";

export const updatePlan = async (
  id: string,
  body: UpdatePaystackPlanDto,
): Promise<UpdatePlanResponse> => {
  const url = `${env.PAYSTACK_API_BASE}/plan/${id}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorResponse = await res.json();
    const errorMessage =
      errorResponse.message || "Failed to create subscription";
    return [false, new PaystackServiceError(errorMessage)];
  }

  const responseData: PaystackGeneralResponse = await res.json();
  if (!responseData.status) {
    const errorMessage =
      responseData.message || "Failed to create subscription";
    return [false, new PaystackServiceError(errorMessage)];
  }

  return [true, null];
};
