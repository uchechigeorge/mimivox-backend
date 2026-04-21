import { ResponseMeta } from "@/lib/dtos/shared/response-meta";
import { UserAuthItems } from "@/lib/types";

export type ListMusicsMetaResponse = ResponseMeta & {};

export type GenerateMusicValidationOptions = {
  prompt: string;
  authItems: UserAuthItems;
};
