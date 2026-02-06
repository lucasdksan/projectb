"use server";

import { AIContentController } from "@/backend/controllers/aicontent.controller";
import { getCurrentUser } from "@/libs/auth";

export type QuantityActionResult = 
    | { success: true; data: { quantity: number } }
    | { success: false; errors: Record<string, string[] | undefined> };

export async function quantityAction(): Promise<QuantityActionResult> {
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
        const quantity = await AIContentController.quantity(userId);
 
        return { 
            success: true, 
            data: { quantity } 
        };
    } catch (error) {
        console.error("Erro ao obter quantidade de conteúdos:", error);
        return { 
            success: false, 
            errors: { 
                global: [error instanceof Error ? error.message : "Falha ao obter quantidade de conteúdos."] 
            } 
        };
    }
}