export type PaystackGeneralResponse = {
  status: boolean;
  message: string;
};

export type PaystackBaseResponse<T> =
  | {
      status: false;
      message: string;
    }
  | {
      status: true;
      message: string;
      data: T;
    };
