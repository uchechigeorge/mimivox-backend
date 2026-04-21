export const successResponse = (
  data?: any,
  message = "Success",
  status = 200,
  meta?: any,
) => ({
  success: true,
  status,
  message,
  data,
  meta,
});

export const okResponse = (message = "Success", status = 200) =>
  successResponse(undefined, message, status);

export const listResponse = (
  data: any,
  meta: any,
  message = "Success",
  status = 200,
) => successResponse(data, message, status, meta);

export const getResponse = (data: any, message = "Success", status = 200) =>
  successResponse(data, message, status);

export const createdResponse = (data: any, message = "Success", status = 201) =>
  successResponse(data, message, status);

export const createdResponseMeta = (
  data: any,
  meta: any,
  message = "Success",
  status = 201,
) => successResponse(data, message, status, meta);

export const errorResponse = (message: string, status = 400, errors?: any) => ({
  success: false,
  message,
  status,
  errors,
});
