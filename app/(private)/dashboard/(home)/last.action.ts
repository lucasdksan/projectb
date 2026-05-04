"use server";

import { getActionErrorMessage } from "@/libs/action-error";
import { AIContentService } from "@/backend/services/aicontent.service";
import type { ContentAIResponse } from "@/backend/schemas/aicontent.schema";
import { getCurrentUser } from "@/libs/auth";

export type LastActionResult = 
    | { success: true; data: { lastContent: ContentAIResponse[] } }
    | { success: false; errors: Record<string, string[] | undefined> };

export async function lastAction(): Promise<LastActionResult> {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return { 
                success: false, 
                errors: { 
                    global: ["Usuário não autenticado"] 
                } 
            };
        }

        const userId = typeof user.sub === "string" ? parseInt(user.sub, 10) : user.sub;
        const contents = await AIContentService.lastContent(userId);

        return { 
            success: true, 
            data: { lastContent: contents || [] } 
        };
    } catch (error) {
        console.error("Erro ao obter último conteúdo:", error);
        return { 
            success: false, 
            errors: { 
                global: [
                    getActionErrorMessage(
                        error,
                        "Falha ao obter último conteúdo.",
                    ),
                ]
            } 
        };
    }
}