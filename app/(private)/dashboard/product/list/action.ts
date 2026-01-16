"use server";

import { StoreService } from "@/backend/modules/store/store.service";
import { AppError } from "@/backend/shared/errors/app-error";

export async function listProductsAction(userId: string){

}

export async function getStoreAction(userId: string){
    try {
        const store = await StoreService.findByUserId(userId);

        if(!store) return {
            success: false,
            store: null,
            message: "O usuário não possui loja cadastrada",
            errors: { store: ["O usuário não possui loja cadastrada"] }
        };

        return {
            success: true,
            store,
            message: "Loja encontrada com sucesso",
            errors: null
        };
        
    } catch (error) {
        return {
            success: false,
            store: null,
            errors: error instanceof AppError ? error.details : null,
            message: error instanceof AppError ? error.message : "Erro ao buscar loja",
        };
    }
}