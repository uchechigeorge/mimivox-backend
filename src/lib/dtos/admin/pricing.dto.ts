import { pricingUpdateDtoValidator } from "@/lib/validators/admin/pricing.validator";
import z from "zod";

export type PricingUpdateDto = z.infer<typeof pricingUpdateDtoValidator>;
