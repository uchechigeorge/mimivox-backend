import { PaystackMetadataTypes } from "@/lib/data/PaystackMetadata";

export type ReadSubscriptionMetaDetailsDto = {
  paystackPayload: PaystackPayload;
  paystackMetadata: PaystackMetadata;
};

export type PaystackPayload = {
  email: string;
  amount: number;
  channels: string[];
  metadata: PaystackMetadata;
};

export type PaystackMetadata = {
  type: PaystackMetadataTypes;
  paymentToken: string;
};

export type GetMetaArgs = {
  paymentToken: string;
  email: string;
  amount: number;
};
