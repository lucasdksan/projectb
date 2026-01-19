"use server";

import { ProductService } from "@/backend/modules/product/product.service";
import { StoreService } from "@/backend/modules/store/store.service";
import { AppError } from "@/backend/shared/errors/app-error";

export async function getProductAction(id: number) {
    try {
        const product = await ProductService.findById(id);

        if(!product) return {
            success: false,
            product: null,
            message: "Produto não encontrado",
            errors: { product: ["Produto não encontrado"] }
        };

        return {
            success: true,
            product,
            message: "Produto encontrado com sucesso",
            errors: null
        };
    } catch (error) {
        return {
            success: false,
            product: null,
            errors: error instanceof AppError ? error.details : null,
            message: error instanceof AppError ? error.message : "Erro ao buscar produto",
        };
    }
}

export async function getStoreByUserIdAction(userId: string){
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