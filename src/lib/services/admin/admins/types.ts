import { ResponseMeta } from "@/lib/dtos/shared/response-meta";

export type AdminListMetaResponse = ResponseMeta & {};

export type AdminCreateResponseMeta = {
  password: string;
};
