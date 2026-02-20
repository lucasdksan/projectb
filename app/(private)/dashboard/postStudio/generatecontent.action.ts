"use server";

import { PostStudioController } from "@/backend/controllers/poststudio.controller";
import { generateContentSchema } from "@/backend/schemas/generatecontent.schema";

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
    const parsed = generateContentSchema.safeParse(raw);
    
    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        }
    }

    try {
        const result = await PostStudioController.generateContent(parsed.data);
        
        return {
            success: true,
            data: result.data,
        }
    } catch (error) {
        console.error("Erro ao gerar conteúdo:", error);
        return { success: false, errors: { global: [error instanceof Error ? error.message : "Falha ao gerar conteúdo. Tente novamente."] } };
    }
}