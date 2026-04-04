"use server";

import { getActionErrorMessage } from "@/libs/action-error";
import { GenerateAddsService } from "@/backend/services/generateadds.service";
import { generateAddsFormSchema } from "@/backend/schemas/generateadds.schema";
import type { GenerateAddsResult } from "@/backend/schemas/generateadds.schema";

export type GenerateAddsActionResult =
    | { success: true; data: GenerateAddsResult }
    | { success: false; errors: Record<string, string[] | undefined> };

export async function generateAddsAction(
    _prevState: GenerateAddsActionResult | null,
    formData: FormData
): Promise<GenerateAddsActionResult> {
    try {
        const raw = {
            name: formData.get("name"),
            description: formData.get("description") || undefined,
            price: formData.get("price"),
            stock: formData.get("stock"),
            image: formData.get("image") || undefined,
            imageUrl: formData.get("imageUrl") || undefined,
        };

        const parsed = generateAddsFormSchema.safeParse(raw);

        if (!parsed.success) {
            return {
                success: false,
                errors: parsed.error.flatten().fieldErrors,
            };
        }

        const result = await GenerateAddsService.generateAdds(parsed.data);

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error("Erro ao gerar anúncio:", error);
        return {
            success: false,
            errors: {
                global: [
                    getActionErrorMessage(
                        error,
                        "Falha ao gerar anúncio. Tente novamente.",
                    ),
                ],
            },
        };
    }
}
