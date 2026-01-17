"use server";

import { ProductService } from "@/backend/modules/product/product.service";
import { AppError } from "@/backend/shared/errors/app-error";

export async function getProductAction(slug: string) {
    try {
        
    } catch (error) {
        return {
            success: false,
            product: null,
            errors: error instanceof AppError ? error.details : null,
            message: error instanceof AppError ? error.message : "Erro ao buscar produto",
        };
    }
}