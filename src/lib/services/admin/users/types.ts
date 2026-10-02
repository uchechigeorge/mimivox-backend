import { ResponseMeta } from "@/lib/dtos/shared/response-meta";

export type UserSubscriberSummary = {
  total: number;
  active: number;
  inactive: number;
};

export type UserListMetaResponse = ResponseMeta & {
  summary: UserSubscriberSummary;
};
