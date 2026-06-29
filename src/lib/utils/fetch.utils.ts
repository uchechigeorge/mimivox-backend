import { env } from "../config/env.config";
import { PaystackBaseResponse } from "../services/shared/paystack/types";
import { InternalServerError } from "./error.util";

export async function appPaystackFetch<TResponse, TBody>(
  options: AppPaystackFetchOptions<TBody>,
): Promise<AppPaystackFetchResponse<TResponse>> {
  let { customErrorMessage, method, urlPath, body } = options;
  customErrorMessage ??= "Paystack error: Failed to complete request";
  method ??= "POST";

  const url = `${env.PAYSTACK_API_BASE}/${urlPath}`;
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorResponse = await res.json();
    const errorMessage = errorResponse.message || customErrorMessage;
    return [null, new InternalServerError(errorMessage)];
  }

  const responseData: PaystackBaseResponse<TResponse> = await res.json();
  if (!responseData.status) {
    const errorMessage = responseData.message || customErrorMessage;
    return [null, new InternalServerError(errorMessage)];
  }

  return [responseData.data, null];
}

export type AppPaystackFetchOptions<TBody> = {
  urlPath: string;
  body?: TBody;
  method?: "GET" | "POST" | "PUT";
  customErrorMessage?: string;
};

export type AppPaystackFetchResponse<TResponse> =
  | [TResponse, null]
  | [null, Error];
