import { appPaystackFetch } from "@/lib/utils/fetch.utils";
import {
  CreateSubscriptionRequestBody,
  CreateSubscriptionResponse,
  DisableSubscriptionRequestBody,
  PaystackSubscription,
} from "./types";

export const createSubscription = async (
  body: CreateSubscriptionRequestBody,
): Promise<CreateSubscriptionResponse> => {
  const response = await appPaystackFetch<
    PaystackSubscription,
    CreateSubscriptionRequestBody
  >({
    urlPath: "subscription",
    body,
    method: "POST",
    customErrorMessage: "Paystack error: Failed to create subscription",
  });
  return response;
};

export const fetchSubscription = async (
  id: string,
): Promise<CreateSubscriptionResponse> => {
  const response = await appPaystackFetch<PaystackSubscription, undefined>({
    urlPath: `subscription/${id}`,
    method: "GET",
    customErrorMessage: "Paystack error: Failed to fetch subscription",
  });
  return response;
};

export const disableSubscription = async (
  body: DisableSubscriptionRequestBody,
) => {
  await appPaystackFetch<boolean, DisableSubscriptionRequestBody>({
    urlPath: "subscription/disable",
    body,
    method: "POST",
    customErrorMessage: "Paystack error: Failed to disable subscription",
  });
};

const paystackSubscriptionService = {
  createSubscription,
  fetchSubscription,
  disableSubscription,
};

export default paystackSubscriptionService;
