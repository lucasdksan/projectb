"use server";

import { unstable_cache } from "next/cache";
import { ProductForSuggestionsController } from "@/backend/controllers/productforsuggestions.controller";
import {
    productForSuggestionsSchema,
    type ProductForSuggestionsDTO,
    type ProductForSuggestionsResponse,
} from "@/backend/schemas/productforsuggestions.schema";

export type ProductForSuggestionsActionResult =
    | { success: true; data: ProductForSuggestionsResponse }
    | { success: false; errors: Record<string, string[] | undefined> };

const CACHE_TTL_SECONDS = 3600; // 1 hora

const getCachedSuggestion = unstable_cache(
    async (_productId: number, dto: ProductForSuggestionsDTO) => {
        return ProductForSuggestionsController.generateSuggestion(dto);
    },
    ["product-suggestion"],
    {
        revalidate: CACHE_TTL_SECONDS,
        tags: ["product-suggestions"],
    }
);

export async function productForSuggestionsAction(data: {
    productId: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
}): Promise<ProductForSuggestionsActionResult> {
    try {
        const parsed = productForSuggestionsSchema.safeParse({
            name: data.name,
            description: data.description,
            price: Number(data.price),
            stock: Number(data.stock),
        });

        if (!parsed.success) {
            return {
                success: false,
                errors: parsed.error.flatten().fieldErrors,
            };
        }

        const result = await getCachedSuggestion(data.productId, parsed.data);

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error("Erro ao gerar sugestão:", error);
        return {
            success: false,
            errors: {
                global: [
                    error instanceof Error
                        ? error.message
                        : "Falha ao gerar sugestão. Tente novamente.",
                ],
            },
        };
    }
}
