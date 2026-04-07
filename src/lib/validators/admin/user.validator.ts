import z from "zod";

export const updateUserSubscriptionParamsValidator = z.object({
  id: z.string().min(1),
});

export const updateUserSubscriptionValidator = z.object({
  isActive: z.boolean(),
  pricingId: z.string().min(1),
  amount: z.number().min(0).optional(),
  startDate: z.date().optional(),
});
