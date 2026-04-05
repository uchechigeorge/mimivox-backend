export const successResponse = (
  data?: any,
  message = "Success",
  status = 200,
) => ({
  success: true,
  status,
  message,
  data,
});

export const okResponse = (message = "Success", status = 200) =>
  successResponse(undefined, message, status);

export const errorResponse = (message: string, status = 400, errors?: any) => ({
  success: false,
  message,
  status,
  errors,
});
