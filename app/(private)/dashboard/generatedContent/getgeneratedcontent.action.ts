"use server";

import { AIContentController } from "@/backend/controllers/aicontent.controller";
import { getCurrentUser } from "@/libs/auth";

export type GetGeneratedContentActionResult = 
    | { success: true; data: { contents: any[] } }
    | { success: false; errors: Record<string, string[] | undefined> };

export async function getGeneratedContentAction(): Promise<GetGeneratedContentActionResult> {
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
        const contents = await AIContentController.list(userId);

        return { 
            success: true, 
            data: { contents: contents || [] } 
        };
    } catch (error) {
        console.error("Erro ao listar conteúdos:", error);
        return { 
            success: false, 
            errors: { 
                global: [error instanceof Error ? error.message : "Falha ao carregar conteúdos."] 
            } 
        };
    }
}