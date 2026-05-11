import {
  nBoolean,
  nDate,
  nNumber,
  nString,
  rNumber,
  rString,
} from "@/lib/utils/zod.utils";
import { z } from "zod";

export const subscriptionCreateValidator = z.object({
  pricingId: rString,
  amount: rNumber,
});

export const subscriptionGetByPaymentTokenParamsValidator = z.object({
  id: z.string(),
});

export const subscriptionReadValidator = z.object({
  id: nString,
  pricingId: nString,
  pricingName: nString,
  isActive: nBoolean,
  status: nString,
  startDate: nDate,
  initialAmount: nNumber,
  paymentToken: nString,
  // pricing: nObjPromise({
  //   id: nNumber,
  //   title: nString,
  //   price: nNumber,
  //   oldPrice: nNumber,
  //   paystackPlan: nObjPromise({
  //     id: nNumber,
  //     planCode: nString,
  //     name: nString,
  //     amount: nNumber,
  //     interval: nString,
  //     description: nString,
  //   }),
  // }),
  // user: nObjPromise({
  //   id: nNumber,
  //   email: nString,
  //   firstName: nString,
  //   lastName: nString,
  //   fullName: nString,
  //   phoneNumber: nString,
  // }),
  updatedAt: nDate,
  createdAt: nDate,
});
