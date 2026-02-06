export type AppErrorCode =
    | "VALIDATION_ERROR"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "CONFLICT"
    | "INTERNAL_ERROR";

export interface AppErrorOptions {
    message: string;
    code?: AppErrorCode;
    statusCode?: number;
    details?: unknown;
}

export class AppError extends Error {
    public readonly code: AppErrorCode;
    public readonly statusCode: number;
    public readonly details?: unknown;
    public readonly isAppError = true;

    constructor({
        message,
        code = "INTERNAL_ERROR",
        statusCode = 500,
        details,
    }: AppErrorOptions) {
        super(message);

        this.code = code;
        this.statusCode = statusCode;
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
}