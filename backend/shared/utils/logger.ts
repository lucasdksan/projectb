import { env } from "@/libs/env";

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogPayload {
    message: string;
    context?: string;
    data?: unknown;
    error?: unknown;
}

function formatLog(level: LogLevel, payload: LogPayload) {
    return {
        timestamp: new Date().toISOString(),
        level,
        message: payload.message,
        context: payload.context,
        data: payload.data,
        error:
            payload.error instanceof Error
                ? {
                    name: payload.error.name,
                    message: payload.error.message,
                    stack: payload.error.stack,
                }
                : payload.error,
    };
}

function log(level: LogLevel, payload: LogPayload) {
    const formatted = formatLog(level, payload);

    switch (level) {
        case "error":
            console.error(formatted);
            break;
        case "warn":
            console.warn(formatted);
            break;
        case "debug":
            if (env.NEXT_PUBLIC_NODE_ENV as string !== "production") {
                console.debug(formatted);
            }
            break;
        default:
            console.log(formatted);
    }
}

export const logger = {
    info(payload: LogPayload) {
        log("info", payload);
    },

    warn(payload: LogPayload) {
        log("warn", payload);
    },

    error(payload: LogPayload) {
        log("error", payload);
    },

    debug(payload: LogPayload) {
        log("debug", payload);
    },
};