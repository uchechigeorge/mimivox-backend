import { nDate, nNumber, nString, rString } from "@/lib/utils/zod.utils";
import { z } from "zod";

const creditPackageType = z.enum(["TopUp", "BuyCredit"]);

export const creditPackageListParamsValidator = z.object({
  type: creditPackageType.optional(),
});

export const creditPackageGetParamsValidator = z.object({
  id: z.string().min(1),
});

export const creditPackageReadDtoValidator = z.object({
  id: nString,
  slug: nString,
  name: nString,
  description: nString,
  type: creditPackageType,
  price: nNumber,
  noOfCredits: nNumber,
  sequence: nNumber,
  updatedAt: nDate,
  createdAt: nDate,
});

export const creditPackageCreateDtoValidator = z.object({
  slug: rString.regex(
    /^[a-z0-9-]+$/,
    "Use lowercase letters, numbers and dashes",
  ),
  name: rString,
  description: z.string().trim().nullish(),
  type: creditPackageType,
  price: z.number().positive(),
  noOfCredits: z.number().int().positive(),
  sequence: z.number().int().min(0).default(0),
});

// The type and slug stay fixed once a package exists
export const creditPackageUpdateDtoValidator = z
  .object({
    name: rString,
    description: z.string().trim().nullish(),
    price: z.number().positive(),
    noOfCredits: z.number().int().positive(),
    sequence: z.number().int().min(0),
  })
  .partial();

export const creditPurchaseReadDtoValidator = z.object({
  id: nString,
  reference: nString,
  userId: nString,
  userName: nString,
  packageId: nString,
  packageName: nString,
  type: creditPackageType,
  noOfCredits: nNumber,
  amount: nNumber,
  amountPaid: nNumber,
  currency: nString,
  status: nString,
  paymentVerified: z.boolean().catch(false),
  paidAt: nDate,
  createdAt: nDate,
});
