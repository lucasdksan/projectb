"use server";

import { ContentAIService } from "@/backend/modules/contentAI/contentAI.service";
import { createContentAISchema } from "@/backend/modules/contentAI/contentAI.types";
import { AppError } from "@/backend/shared/errors/app-error";
import { generativeAIUtils } from "@/backend/shared/integrations/ai";

export async function generateAIContentAction(formData: FormData) {
    const file = formData.get("file") as File | null;
    const platform = formData.get("platform") as string | null;

    if (!file || file.size === 0) {
        return {
            success: false,
            message: "Selecione uma imagem"
        };
    }

    if (!platform) {
        return {
            success: false,
            message: "Selecione a plataforma"
        };
    }

    const prompt = `
Você é um especialista em marketing digital.
Analise a imagem e retorne em JSON:

{
 "headline": "",
 "description": "",
 "cta": "",
 "hashtags": []
}

Para a plataforma ${platform}.
`;

    try {
        const result = await generativeAIUtils.singlePromptWithImage(prompt, file);

        return {
            success: true,
            data: result.data,
            message: "Conteúdo gerado com sucesso"
        };
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: "Erro ao gerar conteúdo"
        };
    }
}

export async function createContentAIAction(formData: FormData) {
    const headline = formData.get("headline") as string | null;
    const description = formData.get("description") as string | null;
    const cta = formData.get("cta") as string | null;
    const hashtags = formData.get("hashtags") as string | null;
    const platform = formData.get("platform") as string | null;
    const storeId = formData.get("storeId") as string | null;

    const rawData = {
        headline,
        description,
        cta,
        hashtags,
        platform,
        storeId: storeId ? parseInt(storeId) : -1,
    };

    try {
        const parsed = createContentAISchema.safeParse(rawData);

        if (!parsed.success) {
            return {
                success: false,
                errors: parsed.error.flatten().fieldErrors,
                contentAI: null,
                message: "Dados inválidos"
            };
        }

        const contentAI = await ContentAIService.create(parsed.data);

        return {
            success: true,
            contentAI,
            errors: null,
            message: "Conteúdo AI criado com sucesso"
        };
    } catch (error) {
        return {
            success: false,
            contentAI: null,
            errors: error instanceof AppError ? error.details : null,
            message: error instanceof AppError ? error.message : "Erro ao criar conteúdo AI"
        };
    }
}
