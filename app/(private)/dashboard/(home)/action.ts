"use server";

import { ContentAIService } from "@/backend/modules/contentAI/contentAI.service";
import { ProductService } from "@/backend/modules/product/product.service";
import { AppError } from "@/backend/shared/errors/app-error";

export async function quantityContentAIAction(storeId: number){
    try {
        const quantity = await ContentAIService.quantity({ storeId });

        return {
            success: true,
            quantityContentAI: quantity,
            errors: null,
            message: "Quantidade de conteúdos gerados",
        }
    } catch (error) {
        return {
            success: false,
            quantityContentAI: null,
            errors: error instanceof AppError ? error.details : null,
            message: error instanceof AppError ? error.message : "Erro ao cadastrar loja",
        };
    }
}

export async function quantityProductAction(storeId: number){
    try {
        const quantity = await ProductService.quantity({ storeId });

        return {
            success: true,
            quantityProduct: quantity,
            errors: null,
            message: "Quantidade de produtos",
        }
    } catch (error) {
        return {
            success: false,
            quantityProduct: null,
            errors: error instanceof AppError ? error.details : null,
            message: error instanceof AppError ? error.message : "Erro ao cadastrar loja",
        };
    }
}