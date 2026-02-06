import { aiIntegration } from "../intagrations/ai";
import {
    aiContentResponseSchema,
    type ChatHistoryItem,
    type AIContentResponse,
    SUPPORTED_PLATFORMS,
} from "../schemas/aichat.schema";

const MARKETING_AGENT_SYSTEM = `Você é um especialista em marketing digital focado em e-commerce e redes sociais.
Sua função é criar conteúdo persuasivo para produtos.

IMPORTANTE: Você DEVE responder SEMPRE em formato JSON válido com a seguinte estrutura:
{
  "headline": "Título chamativo e atrativo para o conteúdo (máx 100 caracteres)",
  "description": "Texto principal do conteúdo, persuasivo e adaptado à plataforma",
  "cta": "Call-to-action claro e direto (ex: 'Compre agora!', 'Saiba mais', 'Link na bio')",
  "hashtags": "Hashtags relevantes separadas por espaço (ex: #moda #estilo #tendencia)",
  "platform": "Plataforma alvo (deve ser uma dessas: ${SUPPORTED_PLATFORMS.join(", ")})"
}

REGRAS:
1. SEMPRE retorne JSON válido, sem texto adicional antes ou depois
2. Adapte o tom e estilo para a plataforma especificada
3. Para Instagram: foque em hashtags virais e emojis
4. Para Facebook: texto mais longo e persuasivo
5. Para TikTok: linguagem jovem e tendências
6. Para LinkedIn: tom profissional e corporativo
7. Para Marketplace/E-commerce: foco em características e benefícios do produto
8. Se o usuário não especificar a plataforma, use "instagram" como padrão
9. As hashtags devem ser relevantes para o produto e plataforma`;

function parseAIResponse(response: string): AIContentResponse | null {
    try {
        let cleanResponse = response.trim();
        if (cleanResponse.startsWith("```json")) {
            cleanResponse = cleanResponse.slice(7);
        } else if (cleanResponse.startsWith("```")) {
            cleanResponse = cleanResponse.slice(3);
        }
        if (cleanResponse.endsWith("```")) {
            cleanResponse = cleanResponse.slice(0, -3);
        }
        cleanResponse = cleanResponse.trim();

        const parsed = JSON.parse(cleanResponse);
        const validated = aiContentResponseSchema.safeParse(parsed);

        if (validated.success) {
            return validated.data;
        }
        return null;
    } catch {
        return null;
    }
}

function formatStructuredResponse(content: AIContentResponse): string {
    return `**${content.headline}**

${content.description}

📢 ${content.cta}

${content.hashtags}

📱 Plataforma: ${content.platform}`;
}

export type ChatResponse = {
    data: string;
    structuredContent?: AIContentResponse;
};

export const AIChatService = {
    async sendMessageWithImage(prompt: string, image: Blob): Promise<ChatResponse> {
        const fullPrompt = `${MARKETING_AGENT_SYSTEM}\n\nPedido do usuário: ${prompt}`;
        const { data } = await aiIntegration.singlePromptWithImage(fullPrompt, image);
        return { data };
    },

    async sendMessageWithoutImage(prompt: string): Promise<ChatResponse> {
        const { data } = await aiIntegration.singlePrompt(prompt);
        return { data };
    },

    async sendMessageWithContext(
        prompt: string,
        history: ChatHistoryItem[],
        image?: Blob,
        platform?: string
    ): Promise<ChatResponse> {
        const enhancedPrompt = platform
            ? `[Plataforma: ${platform}] ${prompt}`
            : prompt;

        const { data } = await aiIntegration.chatWithContext(
            MARKETING_AGENT_SYSTEM,
            history,
            enhancedPrompt,
            image
        );

        const structuredContent = parseAIResponse(data);

        if (structuredContent) {
            return {
                data: formatStructuredResponse(structuredContent),
                structuredContent,
            };
        }

        return { data };
    },
};
