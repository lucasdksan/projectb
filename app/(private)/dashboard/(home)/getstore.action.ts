"use server";

import { getCurrentUser } from "@/libs/auth";
import { getActionErrorMessage } from "@/libs/action-error";
import { StoreService } from "@/backend/services/store.service";
import { GetStoreDTO } from "@/backend/schemas/store.schema";

export type GetStoreActionResult = 
    | { success: true; data: { store: GetStoreDTO | undefined }; errors: null }
    | { success: false; errors: Record<string, string[] | undefined>; data: null }; 

export async function getStoreAction(): Promise<GetStoreActionResult> {
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
        const store = await StoreService.getStore(userId);
        
        return {
            success: true,
            data: {
                store: store as GetStoreDTO | undefined 
            },
            errors: null,
        }

    } catch (error) {
        return {
            success: false,
            data: null,
            errors: {
                global: [
                    getActionErrorMessage(error, "Erro ao buscar loja"),
                ],
            },
        }
    }
}