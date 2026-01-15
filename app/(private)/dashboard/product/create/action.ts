"use server";

import { ProductService } from "@/backend/modules/product/product.service";
import { createProductSchema } from "@/backend/modules/product/product.types";
import { StoreService } from "@/backend/modules/store/store.service";

export async function addProductAction(formData: FormData) {
    const attrs = formData.get("attributes");
    const rawData = {
        name: formData.get("name"),
        price: formData.get("price") ? parseInt(`${formData.get("price")}`) : 0,
        stock: formData.get("stock") ? parseInt(`${formData.get("stock")}`) : 0,
        isActive: formData.get("isActive") ? (() => {
            const getValue = formData.get("isActive")?.toString();

            return getValue && getValue === "true";
        })() : false,
        category: formData.get("category")?.toString(),
        storeId: formData.get("storeId") ? parseInt(`${formData.get("storeId")}`) : 0,
        attributes: (typeof attrs === "string")
        ? JSON.parse(attrs)
        : attrs,
        description: formData.get("description")?.toString(),
    };

    try {
        const parsed = createProductSchema.safeParse(rawData);

        if (!parsed.success) {
            return {
                success: false,
                errors: parsed.error.flatten().fieldErrors,
            };
        }

        const product = await ProductService.create(parsed.data);

        return {
            success: true,
            product,
            message: "Produto cadastrado com sucesso",
        };
        
    } catch (error) {
        return {
            success: false,
            product: null,
            message: "Erro ao cadastrar produto",
        };
    }
}

export async function searchStore(userId: string){
    try {
        const store = await StoreService.findByUserId(userId);

        if(!store) return {
            success: false,
            store: null,
            message: "O usuário não possui loja cadastrada"
        };

        return {
            success: true,
            store,
            message: "Loja identificada com sucesso."
        };
        
    } catch (error) {
        return {
            success: false,
            store: null,
            message: "O usuário não possui loja cadastrada"
        };
    }
}