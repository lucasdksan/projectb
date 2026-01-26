"use server";

import { ContentAIService } from "@/backend/modules/contentAI/contentAI.service";
import { createContentAISchema } from "@/backend/modules/contentAI/contentAI.types";
import { StoreService } from "@/backend/modules/store/store.service";
import { AppError } from "@/backend/shared/errors/app-error";
import { aiIntegration } from "@/backend/shared/integrations/ai";
import { instagramIntegration } from "@/backend/shared/integrations/instagram";
import { vercelIntegration } from "@/backend/shared/integrations/vercel";

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
        const result = await aiIntegration.singlePromptWithImage(prompt, file);

        return {
            success: true,
            data: result.data,
            message: "Conteúdo gerado com sucesso"
        };
    } catch (e) {
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

export async function postInstagramAction(formData: FormData) {
    const file = formData.get("file") as File | null;
    const caption = formData.get("caption") as string | null;
    const storeId = formData.get("storeId") as string | null;

    if (!storeId) {
        return {
            success: false,
            message: "Selecione uma loja",
            errors: null,
        };
    }

    if (!file || file.size === 0) {
        return {
            success: false,
            message: "Selecione uma imagem",
            errors: null,
        };
    }

    if (!caption) {
        return {
            success: false,
            message: "Digite uma legenda para a imagem",
            errors: null,
        };
    }

    try {
        const blob = await vercelIntegration.blob.upload(file);
        const instagramConfig = await StoreService.findInstagramConfigByStoreId(parseInt(storeId));

        if (!instagramConfig) {
            return {
                success: false,
                message: "Configuração do Instagram não encontrada",
                errors: null,
            };
        }

        const result = await instagramIntegration.publishToInstagram(blob, caption, instagramConfig.userInstagramId);

        if(!result.success) {
            await vercelIntegration.blob.delete(blob);
            
            return {
                success: false,
                message: result.message,
                errors: null,
            }    
        }

        await new Promise(resolve => setTimeout(resolve, 5000));
        await vercelIntegration.blob.delete(blob);

        return {
            success: true,
            message: "Imagem publicada com sucesso",
            errors: null,
        };
    } catch (error) {
        return {
            success: false,
            message: "Erro ao postar no Instagram",
            errors: error instanceof AppError ? error.details : null,
        };
    }
}