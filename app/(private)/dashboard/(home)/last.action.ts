"use server";

import { AIContentController } from "@/backend/controllers/aicontent.controller";
import { getCurrentUser } from "@/libs/auth";

export type LastActionResult = 
    | { success: true; data: { lastContent: any[] } }
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
        const contents = await AIContentController.lastContent(userId);

        return { 
            success: true, 
            data: { lastContent: contents || [] } 
        };
    } catch (error) {
        console.error("Erro ao obter último conteúdo:", error);
        return { 
            success: false, 
            errors: { 
                global: [error instanceof Error ? error.message : "Falha ao obter último conteúdo."] 
            } 
        };
    }
}