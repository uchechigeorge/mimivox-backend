export type CreateSubscriptionRequestBody = {
  customer: string;
  plan: string;
  authorization?: string;
  start_date?: Date | null;
};

export type DisableSubscriptionRequestBody = {
  /* The code of the subscription to be disabled */
  code: string;
  /* The email token of the customer */
  token: string;
};

export type CreateSubscriptionResponse =
  | [PaystackSubscription, null]
  | [null, Error];

export type DisableSubscriptionResponse = [true, null] | [false, Error];

export type FetchSubscriptionResponse =
  | [PaystackSubscription, null]
  | [null, Error];

export type PaystackSubscription = {
  id: string;
  status: string;
  email_token: string;
  subscription_code: string;
  next_payment_date: Date;
};
