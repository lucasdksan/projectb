import { AppError } from "@/backend/errors/app-error";

export function getActionErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof AppError) {
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return fallback;
}
