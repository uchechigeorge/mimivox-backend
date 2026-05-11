import { PaystackMetadataTypes } from "@/lib/data/PaystackMetadata";

export type ReadSubscriptionMetaDetailsDto = {
  paystackMetadata: PaystackMetadata;
};

export type PaystackMetadata = {
  type: PaystackMetadataTypes;
  paymentToken: string;
};
