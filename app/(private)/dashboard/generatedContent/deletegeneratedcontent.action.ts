"use server";

import { AIContentController } from "@/backend/controllers/aicontent.controller";
import { getCurrentUser } from "@/libs/auth";

export type DeleteGeneratedContentActionResult = 
    | { success: true }
    | { success: false; errors: Record<string, string[] | undefined> };

export async function deleteGeneratedContentAction(id: number): Promise<DeleteGeneratedContentActionResult> {
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
        await AIContentController.delete(id, userId);
        
        return { success: true };
    } catch (error) {
        console.error("Erro ao deletar conteúdo:", error);
        return { 
            success: false, 
            errors: { 
                global: [error instanceof Error ? error.message : "Falha ao deletar conteúdo."] 
            } 
        };
    }
}