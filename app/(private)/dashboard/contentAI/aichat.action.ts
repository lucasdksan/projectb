"use server";

import { AIChatController } from "@/backend/controllers/aichat.controller";
import {
    sendMessageWithImageSchema,
    sendMessageWithoutImageSchema,
    sendMessageWithContextSchema,
    type ChatHistoryItem,
    type AIContentResponse,
    SUPPORTED_PLATFORMS,
    CONTENT_MODES,
} from "@/backend/schemas/aichat.schema";

export type SendMessageActionResult =
    | { success: true; data: { message: string; structuredContent?: AIContentResponse } }
    | { success: false; errors: Record<string, string[] | undefined> };

export async function sendMessageWithImageAction(
    _prevState: SendMessageActionResult | null,
    formData: FormData
): Promise<SendMessageActionResult> {
    try {
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

        const result = await AIChatController.sendMessageWithImage(parsed.data);
        
        return { 
            success: true, 
            data: { message: result.data } 
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            errors: {
                global: [error instanceof Error ? error.message : "Falha ao gerar conteúdo. Tente novamente."]
            }
        };
    }
}

export async function sendMessageWithoutImageAction(
    _prevState: SendMessageActionResult | null,
    formData: FormData
): Promise<SendMessageActionResult> {
    try {
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

        const result = await AIChatController.sendMessageWithoutImage(parsed.data);
        
        return { 
            success: true, 
            data: { message: result.data } 
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            errors: {
                global: [error instanceof Error ? error.message : "Falha ao gerar conteúdo. Tente novamente."]
            }
        };
    }
}

export async function sendMessageWithContextAction(
    _prevState: SendMessageActionResult | null,
    formData: FormData
): Promise<SendMessageActionResult> {
    try {
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
        const platform = typeof platformRaw === "string" && SUPPORTED_PLATFORMS.includes(platformRaw as any)
            ? platformRaw
            : undefined;

        const modeRaw = formData.get("mode");
        const mode = typeof modeRaw === "string" && CONTENT_MODES.includes(modeRaw as any)
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

        const result = await AIChatController.sendMessageWithContext(parsed.data);
        
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
                global: [error instanceof Error ? error.message : "Falha ao gerar conteúdo. Tente novamente."]
            }
        };
    }
}
