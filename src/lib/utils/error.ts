export class AppError extends Error {
  statusCode: number;

  constructor(message: string = "Bad request", statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad request", statusCode: number = 400) {
    super(message, statusCode);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  statusCode: number;
}

export class NotFoundError extends AppError {
  constructor(message: string = "Not found", statusCode: number = 404) {
    super(message, statusCode);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  statusCode: number;
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized", statusCode: number = 401) {
    super(message, statusCode);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  statusCode: number;
}

export class InternalServerError extends AppError {
  constructor(
    message: string = "Internal server error",
    statusCode: number = 500,
  ) {
    super(message, statusCode);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  statusCode: number;
}
