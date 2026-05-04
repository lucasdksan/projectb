"use server";

import { getCurrentUser } from "@/libs/auth";
import { getActionErrorMessage } from "@/libs/action-error";
import { AIChatService } from "@/backend/services/aichat.service";
import {
    sendMessageWithImageSchema,
    sendMessageWithoutImageSchema,
    sendMessageWithContextSchema,
    type ChatHistoryItem,
    type AIContentResponse,
    SUPPORTED_PLATFORMS,
    CONTENT_MODES,
    type Platform,
    type ContentMode,
} from "@/backend/schemas/aichat.schema";

export type SendMessageActionResult =
    | { success: true; data: { message: string; structuredContent?: AIContentResponse } }
    | { success: false; errors: Record<string, string[] | undefined> };

export async function sendMessageWithImageAction(
    _prevState: SendMessageActionResult | null,
    formData: FormData
): Promise<SendMessageActionResult> {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return {
                success: false,
                errors: { global: ["Usuário não autenticado"] },
            };
        }

        const raw = {
            prompt: formData.get("prompt"),
            image: formData.get("image"),
        };

        const parsed = sendMessageWithImageSchema.safeParse(raw);

        if (!parsed.success) {
            return { 
                success: false, 
                errors: parsed.error.flatten().fieldErrors 
            };
        }

        const result = await AIChatService.sendMessageWithImage(
            parsed.data.prompt,
            parsed.data.image as Blob,
        );
        
        return { 
            success: true, 
            data: { message: result.data } 
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            errors: {
                global: [
                    getActionErrorMessage(
                        error,
                        "Falha ao gerar conteúdo. Tente novamente.",
                    ),
                ]
            }
        };
    }
}

export async function sendMessageWithoutImageAction(
    _prevState: SendMessageActionResult | null,
    formData: FormData
): Promise<SendMessageActionResult> {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return {
                success: false,
                errors: { global: ["Usuário não autenticado"] },
            };
        }

        const raw = {
            prompt: formData.get("prompt"),
        };

        const parsed = sendMessageWithoutImageSchema.safeParse(raw);

        if (!parsed.success) {
            return { 
                success: false, 
                errors: parsed.error.flatten().fieldErrors 
            };
        }

        const result = await AIChatService.sendMessageWithoutImage(
            parsed.data.prompt,
        );
        
        return { 
            success: true, 
            data: { message: result.data } 
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            errors: {
                global: [
                    getActionErrorMessage(
                        error,
                        "Falha ao gerar conteúdo. Tente novamente.",
                    ),
                ]
            }
        };
    }
}

export async function sendMessageWithContextAction(
    _prevState: SendMessageActionResult | null,
    formData: FormData
): Promise<SendMessageActionResult> {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return {
                success: false,
                errors: { global: ["Usuário não autenticado"] },
            };
        }

        const historyRaw = formData.get("history");
        let history: ChatHistoryItem[] = [];

        try {
            if (typeof historyRaw === "string" && historyRaw) {
                history = JSON.parse(historyRaw);
            }
        } catch {
            return { 
                success: false, 
                errors: { 
                    global: ["Histórico de mensagens inválido"] 
                } 
            };
        }

        const platformRaw = formData.get("platform");
        const platform = typeof platformRaw === "string" && SUPPORTED_PLATFORMS.includes(platformRaw as Platform)
            ? platformRaw
            : undefined;

        const modeRaw = formData.get("mode");
        const mode = typeof modeRaw === "string" && CONTENT_MODES.includes(modeRaw as ContentMode)
            ? modeRaw
            : "standard";

        const raw = {
            prompt: formData.get("prompt"),
            history,
            image: formData.get("image") || undefined,
            platform,
            mode,
        };

        const parsed = sendMessageWithContextSchema.safeParse(raw);

        if (!parsed.success) {
            return { 
                success: false, 
                errors: parsed.error.flatten().fieldErrors 
            };
        }

        const result = await AIChatService.sendMessageWithContext(
            parsed.data.prompt,
            parsed.data.history,
            parsed.data.image as Blob | undefined,
            parsed.data.platform,
            parsed.data.mode,
        );
        
        return {
            success: true,
            data: {
                message: result.data,
                structuredContent: result.structuredContent,
            }
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            errors: {
                global: [
                    getActionErrorMessage(
                        error,
                        "Falha ao gerar conteúdo. Tente novamente.",
                    ),
                ]
            }
        };
    }
}
