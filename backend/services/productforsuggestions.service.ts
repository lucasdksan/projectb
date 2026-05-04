import { aiIntegration } from "../integrations/ai";
import type { ProductForSuggestionsDTO } from "../schemas/productforsuggestions.schema";
import { formatCurrencyFromCents } from "@/libs/format-currency";

const PROMPT = `Você é um consultor de vendas e marketing para e-commerce.
Com base nos dados do produto abaixo, gere UMA sugestão curta e direta (1-2 frases) para impulsionar vendas ou campanhas de marketing.
Seja objetivo e acionável. Não use bullet points nem listas.
Responda apenas com o texto da sugestão, sem aspas nem prefixos.`;

export const ProductForSuggestionsService = {
    async generateSuggestion(data: ProductForSuggestionsDTO) {
        const context = `Produto: ${data.name}. Descrição: ${data.description ?? "N/A"}. Preço: ${formatCurrencyFromCents(data.price)}. Estoque: ${data.stock}.`;
        const prompt = `${PROMPT}\n\n${context}`;

        const { data: text } = await aiIntegration.singlePrompt(prompt);

        return {
            suggestion: text.trim(),
        };
    },
};
