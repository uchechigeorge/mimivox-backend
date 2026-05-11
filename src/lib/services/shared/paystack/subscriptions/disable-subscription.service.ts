// import { env } from "@/lib/config/env.config";
// import {
//   DisableSubscriptionRequestBody,
//   DisableSubscriptionResponse,
//   PaystackBaseResponse,
//   PaystackSubscription,
// } from "./types";
// import { InternalServerError } from "@/lib/utils/error.util";

// export const disableSubscription = async (
//   body: DisableSubscriptionRequestBody,
// ): Promise<DisableSubscriptionResponse> => {
//   const url = `${env.PAYSTACK_API_BASE}/subscription/disable`;
//   const res = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
//     },
//     body: JSON.stringify(body),
//   });

//   if (!res.ok) {
//     const errorResponse = await res.json();
//     const errorMessage =
//       errorResponse.message || "Failed to create subscription";
//     return [false, new InternalServerError(errorMessage)];
//   }

//   const responseData: PaystackBaseResponse<PaystackSubscription> =
//     await res.json();
//   if (!responseData.status) {
//     const errorMessage =
//       responseData.message || "Failed to create subscription";
//     return [false, new InternalServerError(errorMessage)];
//   }

//   return [true, null];
// };
