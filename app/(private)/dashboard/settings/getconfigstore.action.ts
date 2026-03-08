"use server";

import { getCurrentUser } from "@/libs/auth";
import { StoreController } from "@/backend/controllers/store.controller";

export type GetConfigStoreActionResult = 
    | { success: true; data: { config: { primaryColor: string; secondaryColor: string; logoUrl: string } | null }; errors: null }
    | { success: false; errors: Record<string, string[] | undefined>; data: null }; 

export async function getConfigStoreAction(): Promise<GetConfigStoreActionResult> {
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
        const store = await StoreController.getStore(userId);
        
        if (!store) {
            return {
                success: true,
                data: {
                    config: null,
                },
                errors: null,
            };
        }

        return {
            success: true,
            data: {
                config: store.config ?? null,
            },
            errors: null,
        }

    } catch (error) {
        return {
            success: false,
            data: null,
            errors: {
                global: [error instanceof Error ? error.message : "Erro ao buscar configurações da loja"],
            },
        }
    }
}
