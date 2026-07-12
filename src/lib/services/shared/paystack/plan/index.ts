import { appPaystackFetch } from "@/lib/utils/fetch.utils";
import {
  CreatePaystackPlanOptions,
  CreatePlanResponse,
  GetPaystackPlanParams,
  ListPlanResponse,
  PaystackPlan,
  UpdatePaystackPlanOptions,
  UpdatePlanResponse,
} from "./types";

export const createPlan = async (
  body: CreatePaystackPlanOptions,
): Promise<CreatePlanResponse> => {
  const response = await appPaystackFetch<
    PaystackPlan,
    CreatePaystackPlanOptions
  >({
    urlPath: "plan",
    body,
    method: "POST",
    customErrorMessage: "Paystack error: Failed to create plan",
  });
  return response;
};

export const updatePlan = async (
  id: string,
  body: UpdatePaystackPlanOptions,
): Promise<UpdatePlanResponse> => {
  const response = await appPaystackFetch<true, UpdatePaystackPlanOptions>({
    urlPath: `plan/${id}`,
    body,
    method: "PUT",
    customErrorMessage: "Paystack error: Failed to update plan",
  });
  return response;
};

export const listPlans = async (
  params: GetPaystackPlanParams,
): Promise<ListPlanResponse> => {
  const urlPath = `plan?${new URLSearchParams(
    params as Record<string, string>,
  )}`;
  const response = await appPaystackFetch<
    PaystackPlan[],
    UpdatePaystackPlanOptions
  >({
    urlPath,
    method: "GET",
    customErrorMessage: "Paystack error: Failed to get plans",
  });
  return response;
};

const paystackPlanService = {
  listPlans,
  createPlan,
  updatePlan,
};

export default paystackPlanService;
