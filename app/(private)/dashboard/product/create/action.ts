"use server";

import { ProductService } from "@/backend/modules/product/product.service";
import { createProductSchema, generateDescription, generateDescriptionSchema } from "@/backend/modules/product/product.types";
import { StoreService } from "@/backend/modules/store/store.service";
import { AppError } from "@/backend/shared/errors/app-error";
import { generativeAIUtils } from "@/backend/shared/integrations/ai";

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
        storeId: formData.get("storeId") ? parseInt(`${formData.get("storeId")}`) : -1,
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
                product: null,
                message: "Dados inválidos",
            };
        }

        const product = await ProductService.create(parsed.data);

        return {
            success: true,
            product,
            errors: null,
            message: "Produto cadastrado com sucesso",
        };
        
    } catch (error) {
        return {
            success: false,
            product: null,
            errors: error instanceof AppError ? error.details : null,
            message: error instanceof AppError ? error.message : "Erro ao cadastrar produto",
        };
    }
}

export async function generateDescriptionAction(data: generateDescription) {
    try {
        const parsed = generateDescriptionSchema.safeParse(data);

        if (!parsed.success) {
            return {
                success: false,
                description: null,
                message: "Dados inválidos",
                errors: parsed.error.flatten().fieldErrors,
            };
        }

        const prompt = `Gere uma descrição atraente e detalhada para um produto com as seguintes características:
        Nome: ${parsed.data.name}
        Categoria: ${parsed.data.category}
        Atributos: ${parsed.data.attributes.map(attr => `${attr.kindof}: ${attr.value}`).join(", ")}
        
        A descrição deve ser focada em vendas e destacar os benefícios do produto. Use um tom profissional e persuasivo.`;

        const result = await generativeAIUtils.singlePrompt(prompt);

        return {
            success: true,
            description: result.data,
            errors: null,
            message: "Descrição gerada com sucesso",
        };
    } catch (error) {
        console.error("Error generating description:", error);
        return {
            success: false,
            description: null,
            errors: error instanceof AppError ? error.details : null,
            message: error instanceof AppError ? error.message : "Erro ao gerar descrição com IA",
        };
    }
}

export async function searchStoreAction(userId: string){
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