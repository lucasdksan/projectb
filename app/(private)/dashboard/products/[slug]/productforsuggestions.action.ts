"use server";

import { ProductForSuggestionsController } from "@/backend/controllers/productforsuggestions.controller";
import {
    productForSuggestionsSchema,
    type ProductForSuggestionsResponse,
} from "@/backend/schemas/productforsuggestions.schema";

export type ProductForSuggestionsActionResult =
    | { success: true; data: ProductForSuggestionsResponse }
    | { success: false; errors: Record<string, string[] | undefined> };

export async function productForSuggestionsAction(
    data: { name: string; description?: string; price: number; stock: number }
): Promise<ProductForSuggestionsActionResult> {
    try {
        const parsed = productForSuggestionsSchema.safeParse({
            ...data,
            price: Number(data.price),
            stock: Number(data.stock),
        });

        if (!parsed.success) {
            return {
                success: false,
                errors: parsed.error.flatten().fieldErrors,
            };
        }

        const result = await ProductForSuggestionsController.generateSuggestion(parsed.data);

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
