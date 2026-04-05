import { aiIntegration } from "../intagrations/ai";
import {
    aiContentResponseSchema,
    type ChatHistoryItem,
    type AIContentResponse,
    type ContentMode,
    SUPPORTED_PLATFORMS,
} from "../schemas/aichat.schema";

const JSON_RESPONSE_RULES = `
IMPORTANTE: Você DEVE responder SEMPRE em formato JSON válido com a seguinte estrutura:
{
  "headline": "Título chamativo e atrativo para o conteúdo (máx 100 caracteres)",
  "description": "Texto principal do conteúdo, persuasivo e adaptado à plataforma",
  "cta": "Call-to-action claro e direto (ex: 'Compre agora!', 'Saiba mais', 'Link na bio')",
  "hashtags": "Hashtags relevantes separadas por espaço (ex: #moda #estilo #tendencia)",
  "platform": "Plataforma alvo (deve ser uma dessas: ${SUPPORTED_PLATFORMS.join(", ")})"
}
REGRAS: 1. SEMPRE retorne JSON válido, sem texto adicional antes ou depois. 2. Se o usuário não especificar a plataforma, use "instagram" como padrão.`;

const MARKETING_AGENT_SYSTEM = `Você é um especialista em marketing digital focado em e-commerce e redes sociais.
Sua função é criar conteúdo persuasivo para produtos.
${JSON_RESPONSE_RULES}
Adapte o tom e estilo para a plataforma: Instagram (hashtags virais e emojis), Facebook (texto mais longo), TikTok (linguagem jovem e tendências), LinkedIn (tom profissional), Marketplace/E-commerce (benefícios do produto).`;

const VIRAL_TRENDS_SYSTEM = `Você é um analista de tendências (Google Trends, TikTok Creative Center, Pinterest). Responda em texto livre, direto ao ponto — estilo ChatGPT: sem JSON, sem formulários.

Regras:
- Mostre as tendências de fato: lista numerada com nome da tendência, por que está em alta e como o usuário pode usar.
- Seja específico e acionável (formatos em alta, temas, hashtags, melhores horários).
- Respostas curtas e objetivas. Use quebras de linha e listas quando fizer sentido.
- Não use frases como "confira nosso post" ou "analisamos para você".`;

const SCHEDULE_AGENT_SYSTEM = `Você é um estrategista de mídias sociais e planejamento de conteúdo. Responda em texto livre, direto ao ponto — estilo ChatGPT: sem JSON, sem formulários.

O usuário descreve a campanha (objetivo, público, tom, duração, restrições) e pode enviar uma imagem como referência de temática, estética ou produto — use a imagem apenas como norte visual e temático para alinhar o cronograma ao que foi mostrado.

Sua função é gerar um cronograma de postagens para UMA SEMANA (segunda a domingo). Para cada dia inclua:
- dia da semana;
- plataforma sugerida (ex.: Instagram feed, Stories, Reels, TikTok, YouTube live, etc.);
- tipo de conteúdo (post, live, carrossel, vídeo curto, etc.);
- tema ou ângulo do post em 1 linha;
- quando fizer sentido, horário ou faixa sugerida (opcional).

Seja específico e acionável. Use listas, títulos curtos e quebras de linha. Se faltar informação, assuma premissas razoáveis e mencione brevemente o que você assumiu.`;

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
        platform?: string,
        mode: ContentMode = "standard"
    ): Promise<ChatResponse> {
        const systemPrompt =
            mode === "viral"
                ? VIRAL_TRENDS_SYSTEM
                : mode === "schedule"
                  ? SCHEDULE_AGENT_SYSTEM
                  : MARKETING_AGENT_SYSTEM;

        const enhancedPrompt = platform
            ? `[Plataforma: ${platform}] ${prompt}`
            : prompt;

        const { data } = await aiIntegration.chatWithContext(
            systemPrompt,
            history,
            enhancedPrompt,
            image,
        );

        if (mode === "standard") {
            const structuredContent = parseAIResponse(data);
            if (structuredContent) {
                return {
                    data: formatStructuredResponse(structuredContent),
                    structuredContent,
                };
            }
        }

        return { data };
    },
};
