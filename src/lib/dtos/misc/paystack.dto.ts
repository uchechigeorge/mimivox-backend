import { handlePaystackWebhookDto } from "@/lib/validators/misc/paystack.validator";
import z from "zod";

export type HandlePaystackWebhookDto = z.infer<typeof handlePaystackWebhookDto>;

export type HandlePaystackWebhookHeader = {
  bodyString: string;
  signature: Nullish<string>;
  ipAddress: Nullish<string>;
};

type Nullish<T> = T | null | undefined;
