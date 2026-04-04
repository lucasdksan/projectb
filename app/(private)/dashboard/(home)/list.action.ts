"use server";

import { getActionErrorMessage } from "@/libs/action-error";
import { AIContentService } from "@/backend/services/aicontent.service";
import { getCurrentUser } from "@/libs/auth";

export type ListActionResult = 
    | { success: true; data: { contents: any[] } }
    | { success: false; errors: Record<string, string[] | undefined> };

export async function listAction(): Promise<ListActionResult> {
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
        const contents = await AIContentService.list(userId);

        return { 
            success: true, 
            data: { contents: contents || [] } 
        };
    } catch (error) {
        console.error("Erro ao listar conteúdos:", error);
        return { 
            success: false, 
            errors: { 
                global: [
                    getActionErrorMessage(error, "Falha ao carregar conteúdos."),
                ]
            } 
        };
    }
}