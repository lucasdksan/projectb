"use server";

import { getActionErrorMessage } from "@/libs/action-error";
import { ProductForSuggestionsService } from "@/backend/services/productforsuggestions.service";
import {
    productForSuggestionsSchema,
    type ProductForSuggestionsResponse,
} from "@/backend/schemas/productforsuggestions.schema";

export type ProductForSuggestionsActionResult =
    | { success: true; data: ProductForSuggestionsResponse }
    | { success: false; errors: Record<string, string[] | undefined> };

export async function productForSuggestionsAction(data: {
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

        const result =
            await ProductForSuggestionsService.generateSuggestion(parsed.data);

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error("Erro ao gerar sugestão:", error);
        const msg = getActionErrorMessage(
            error,
            "Falha ao gerar sugestão. Tente novamente.",
        );
        const isQuotaError = msg.includes("429") || msg.includes("quota") || msg.includes("Too Many Requests");
        return {
            success: false,
            errors: {
                global: [
                    isQuotaError
                        ? "Limite de uso da IA atingido. Tente novamente em alguns minutos ou amanhã."
                        : msg || "Falha ao gerar sugestão. Tente novamente.",
                ],
            },
        };
    }
}
