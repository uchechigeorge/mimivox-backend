import z from "zod";

export const pricingUpdateParamsValidator = z.object({
  id: z.guid(),
});

export const pricingUpdateDtoValidator = z.object({
  price: z.number().min(0),
  oldPrice: z.number().min(0).nullish(),
});
