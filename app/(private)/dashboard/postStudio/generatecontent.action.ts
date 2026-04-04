"use server";

import { getActionErrorMessage } from "@/libs/action-error";
import { PostStudioService } from "@/backend/services/poststudio.service";
import { postStudioSchema } from "@/backend/schemas/poststudio.schema";

export type GenerateContentActionResult =
    | { success: true; data: string }
    | { success: false; errors: Record<string, string[] | undefined> };

export async function generateContentAction(
    _prevState: GenerateContentActionResult,
    formData: FormData
): Promise<GenerateContentActionResult> {
    const raw = {
        image: formData.get("image"),
        headline: formData.get("headline"),
        customContext: formData.get("customContext") || undefined,
        style: formData.get("style"),
    };
    const parsed = postStudioSchema.safeParse(raw);
    
    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        }
    }

    try {
        const result = await PostStudioService.generateContent(parsed.data);
        
        return {
            success: true,
            data: result.data,
        }
    } catch (error) {
        console.error("Erro ao gerar conteúdo:", error);
        return {
            success: false,
            errors: {
                global: [
                    getActionErrorMessage(
                        error,
                        "Falha ao gerar conteúdo. Tente novamente.",
                    ),
                ],
            },
        };
    }
}