import { aiIntegration } from "../intagrations/ai";
import { fetchTrustedProductImageBlob } from "../utils/trusted-product-image-url";
import { GenerateAddsDTO, type GenerateAddsResponse } from "../schemas/generateadds.schema";

const JSON_RESPONSE_RULES = `
IMPORTANTE: Você DEVE responder SEMPRE em formato JSON válido com a seguinte estrutura:
{
  "headline": "Título chamativo para o anúncio (máx 100 caracteres)",
  "description": "Descrição persuasiva do produto para o anúncio",
  "cta": "Call-to-action claro (ex: 'Compre agora!', 'Link na bio', 'Peça o seu')",
  "hashtags": "Hashtags relevantes separadas por espaço",
  "platform": "instagram"
}
REGRAS: 1. SEMPRE retorne JSON válido, sem texto adicional. 2. Foque no impacto visual e venda.`;

async function parseJsonResponse(text: string): Promise<GenerateAddsResponse | null> {
    try {
        let clean = text.trim();
        if (clean.startsWith("```json")) clean = clean.slice(7);
        else if (clean.startsWith("```")) clean = clean.slice(3);
        if (clean.endsWith("```")) clean = clean.slice(0, -3);
        clean = clean.trim();
        return JSON.parse(clean) as GenerateAddsResponse;
    } catch {
        return null;
    }
}

export const GenerateAddsService = {
    async generateAdds(data: GenerateAddsDTO) {
        const productContext = `Produto: ${data.name}. Descrição: ${data.description ?? "N/A"}. Preço: R$ ${data.price.toFixed(2)}. Estoque: ${data.stock}.`;

        if (data.image) {
            const prompt = `Você é um especialista em marketing de e-commerce e Instagram.
${JSON_RESPONSE_RULES}

Analise a imagem do produto fornecida e os dados abaixo. Gere um anúncio persuasivo para Instagram que destaque os benefícios visuais e emocionais do produto.

${productContext}`;

            const result = await aiIntegration.singlePromptWithImage(prompt, data.image);
            const parsed = await parseJsonResponse(result.data);
            return parsed ?? { raw: result.data };
        }

        if (data.imageUrl) {
            let blob: Blob;
            try {
                blob = await fetchTrustedProductImageBlob(data.imageUrl);
            } catch (e) {
                const msg = e instanceof Error ? e.message : "Não foi possível carregar a imagem.";
                throw new Error(msg);
            }
            const prompt = `Você é um especialista em marketing de e-commerce e Instagram.
${JSON_RESPONSE_RULES}

Analise a imagem do produto fornecida e os dados abaixo. Gere um anúncio persuasivo para Instagram.

${productContext}`;

            const result = await aiIntegration.singlePromptWithImage(prompt, blob);
            const parsed = await parseJsonResponse(result.data);
            return parsed ?? { raw: result.data };
        }

        const prompt = `Você é um especialista em marketing de e-commerce e Instagram.
${JSON_RESPONSE_RULES}

Gere um anúncio persuasivo para Instagram baseado nos dados do produto abaixo.

${productContext}`;

        const result = await aiIntegration.singlePrompt(prompt);
        const parsed = await parseJsonResponse(result.data);
        return parsed ?? { raw: result.data };
    },
};