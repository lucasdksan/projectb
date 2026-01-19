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

export async function updateProductAction(id: number, formData: FormData) {
    try {
        const getPrice = formData.get("price");
        const getStock = formData.get("stock");
        const getIsActive = formData.get("isActive");
        const getAttributes = formData.get("attributes");

        const data: any = {
            name: formData.get("name")?.toString(),
            description: formData.get("description")?.toString(),
            price: getPrice ? parseInt(getPrice.toString()) : undefined,
            stock: getStock ? parseInt(getStock.toString()) : undefined,
            category: formData.get("category")?.toString(),
            isActive: getIsActive !== null ? getIsActive.toString() === "true" : undefined,
        }

        // Handle NaN from parseInt
        if (data.price !== undefined && isNaN(data.price)) delete data.price;
        if (data.stock !== undefined && isNaN(data.stock)) delete data.stock;

        if (getAttributes) {
            try {
                data.attributes = JSON.parse(getAttributes.toString());
            } catch (e) {
                console.error("Error parsing attributes JSON:", e);
                data.attributes = [];
            }
        }

        // Clean up undefined values to avoid Zod issues if field is optional but not provided
        Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

        const product = await ProductService.update(id, data);

        return {
            success: true,
            product,
            message: "Produto atualizado com sucesso",
            errors: null
        };
    } catch (error) {
        console.error("updateProductAction error:", error); 

        return {
            success: false,
            product: null,
            errors: error instanceof AppError ? error.details : null,
            message: error instanceof AppError ? error.message : "Erro ao atualizar produto",
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