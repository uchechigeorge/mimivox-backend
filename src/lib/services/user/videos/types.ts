import { User } from "@/generated/prisma/client";
import { ResponseMeta } from "@/lib/dtos/shared/response-meta";
import { UserAuthItems } from "@/lib/types";

export type ListVideosMetaResponse = ResponseMeta & {};

export type GenerateVideoValidationOptions = {
  prompt: string;
  authItems: UserAuthItems;
  duration?: number;
};

export type GenerateVideoValidationResponse = {
  user: User;
  duration?: number;
};
