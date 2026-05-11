export type UpdatePaystackPlanDto = {
  name?: string;
  interval?: string;
  amount?: number;
  description?: string;
  send_invoices?: boolean;
  send_sms?: boolean;
  currency?: string;
  invoice_limit?: number;
  update_existing_subscriptions?: boolean;
};

export type ReadPaystackPlanDto = {
  id: number;
  name?: string;
  amount: number;
  integration: number;
  domain?: string;

  // Unix timestamp / plan reference
  plan_code?: string;

  send_invoices: boolean;
  send_sms: boolean;
  hosted_page: boolean;

  currency?: string;

  createdAt: Date;
  updatedAt: Date;
};

export type GetPaystackPlanParams = {
  page?: number;
  perPage?: number;
  interval?: string;
  status?: string;
  amount?: number;
};

export type CreatePaystackPlanDto = {
  name?: string;
  interval?: string;
  amount?: number;
  description?: string;
  send_invoices?: boolean;
  send_sms?: boolean;
  currency?: string;
  invoice_limit?: number;
};

export type CreatePaystackPlanResponseDto = ReadPaystackPlanDto;

export type CreatePlanResponse =
  | [CreatePaystackPlanResponseDto, null]
  | [null, Error];
export type ListPlanResponse = [ReadPaystackPlanDto[], null] | [null, Error];
export type UpdatePlanResponse = [true, null] | [false, Error];
