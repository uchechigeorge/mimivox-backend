// import axios from "axios";
// import {
//   FetchSubscriptionResponse,
//   PaystackBaseResponse,
//   PaystackSubscription,
// } from "./types";
// import { InternalServerError } from "@/helpers/exception-helpers";

// export const fetchSubscription = async (
//   id: string
// ): Promise<FetchSubscriptionResponse> => {
//   let errorMessage: string = "";

//   const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
//   const PAYSTACK_API_BASE = process.env.PAYSTACK_API_BASE;

//   if (!PAYSTACK_SECRET_KEY || !PAYSTACK_API_BASE) {
//     errorMessage =
//       "Paystack env config is missing: PAYSTACK_SECRET_KEY, PAYSTACK_API_BASE";
//     return [null, new InternalServerError(errorMessage)];
//   }

//   let data: PaystackSubscription | null = null;

//   try {
//     const response = await axios.get<
//       PaystackBaseResponse<PaystackSubscription>
//     >(`${PAYSTACK_API_BASE}/subscription/${id}`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
//       },
//     });

//     if (response.data.status) {
//       data = response.data.data;
//     } else {
//       errorMessage = response.data.message;
//       return [null, new InternalServerError(errorMessage)];
//     }
//   } catch (error) {
//     if (error.response) {
//       errorMessage = error.response.data.message;
//     } else if (error.request) {
//       errorMessage = "Request could not be processed";
//     } else {
//       errorMessage = error.message;
//     }

//     return [null, new InternalServerError(errorMessage)];
//   }

//   return [data, null];
// };
