"use server";

import { getActionErrorMessage } from "@/libs/action-error";
import { AIContentService } from "@/backend/services/aicontent.service";
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
        const quantity = await AIContentService.quantity(userId);
 
        return { 
            success: true, 
            data: { quantity } 
        };
    } catch (error) {
        console.error("Erro ao obter quantidade de conteúdos:", error);
        return { 
            success: false, 
            errors: { 
                global: [
                    getActionErrorMessage(
                        error,
                        "Falha ao obter quantidade de conteúdos.",
                    ),
                ]
            } 
        };
    }
}