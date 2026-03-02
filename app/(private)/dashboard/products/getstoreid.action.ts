"use server";

import { getCurrentUser } from "@/libs/auth";
import { StoreController } from "@/backend/controllers/store.controller";

export type GetStoreIdActionResult = 
    | { success: true; data: { storeId: number }; errors: null }
    | { success: false; errors: Record<string, string[] | undefined>; data: null }; 

export async function getStoreIdAction(): Promise<GetStoreIdActionResult> {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return { 
                success: false, 
                data: null,
                errors: { 
                    global: ["Usuário não autenticado"] 
                } 
            };
        }

        const userId = typeof user.sub === "string" ? parseInt(user.sub, 10) : user.sub;
        const storeId = await StoreController.getStoreId(userId);

        if (!storeId) {
            return {
                success: false,
                data: null,
                errors: {
                    global: ["Nenhuma loja cadastrada. Cadastre uma loja primeiro."]
                }
            };
        }
        
        return {
            success: true,
            data: {
                storeId: storeId as number
            },
            errors: null,
        }

    } catch (error) {
        return {
            success: false,
            data: null,
            errors: {
                global: [error instanceof Error ? error.message : "Erro ao atualizar usuário"],
            },
        }
    }
}