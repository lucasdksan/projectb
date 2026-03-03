import type { ProductForSuggestionsDTO } from "../schemas/productforsuggestions.schema";
import { ProductForSuggestionsService } from "../services/productforsuggestions.service";

export const ProductForSuggestionsController = {
    async generateSuggestion(dto: ProductForSuggestionsDTO) {
        return await ProductForSuggestionsService.generateSuggestion(dto);
    },
};
