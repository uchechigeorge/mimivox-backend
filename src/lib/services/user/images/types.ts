import { ResponseMeta } from "@/lib/dtos/shared/response-meta";
import { UserAuthItems } from "@/lib/types";

export type ListImagesMetaResponse = ResponseMeta & {};

export type GenerateImageValidationOptions = {
  prompt: string;
  authItems: UserAuthItems;
};
