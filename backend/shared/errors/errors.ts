import { AppError } from "./app-error";

export const Errors = {
  validation(message = "Invalid data", details?: unknown) {
    return new AppError({
      message,
      code: "VALIDATION_ERROR",
      statusCode: 400,
      details,
    });
  },

  unauthorized(message = "Unauthorized") {
    return new AppError({
      message,
      code: "UNAUTHORIZED",
      statusCode: 401,
    });
  },

  forbidden(message = "Forbidden") {
    return new AppError({
      message,
      code: "FORBIDDEN",
      statusCode: 403,
    });
  },

  notFound(message = "Resource not found") {
    return new AppError({
      message,
      code: "NOT_FOUND",
      statusCode: 404,
    });
  },

  conflict(message = "Conflict") {
    return new AppError({
      message,
      code: "CONFLICT",
      statusCode: 409,
    });
  },

  internal(message = "Internal server error") {
    return new AppError({
      message,
      code: "INTERNAL_ERROR",
      statusCode: 500,
    });
  },
};
