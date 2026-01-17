"use server";

import { ProductService } from "@/backend/modules/product/product.service";
import { paginationProductsSchema } from "@/backend/modules/product/product.types";
import { StoreService } from "@/backend/modules/store/store.service";
import { AppError } from "@/backend/shared/errors/app-error";

export async function paginationProductsAction(storeId: number, page: number, limit: number){
    try {
        const parsed = paginationProductsSchema.safeParse({ page, limit, storeId });

        if (!parsed.success) {
            return {
                success: false,
                errors: parsed.error.flatten().fieldErrors,
                products: null,
                message: "Dados inválidos",
            };
        }

        const products = await ProductService.paginationByStoreId(parsed.data.storeId, parsed.data.page, parsed.data.limit);

        return {
            success: true,
            products,
            errors: null,
            message: "Produtos encontrados com sucesso",
        };
    } catch (error) {
        return {
            success: false,
            products: null,
            errors: error instanceof AppError ? error.details : null,
            message: error instanceof AppError ? error.message : "Erro ao buscar produtos",
        };
    }
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