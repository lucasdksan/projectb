"use server";

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
