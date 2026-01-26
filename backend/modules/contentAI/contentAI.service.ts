import { Errors } from "@/backend/shared/errors/errors";
import { ContentAIRepository } from "./contentAI.repository";
import { createContentAI, createContentAISchema, quantityContentAI, quantityContentAISchema } from "./contentAI.types";

export const ContentAIService = {
    async create(data: createContentAI){
        const validatedData = createContentAISchema.safeParse(data);

        if(!validatedData.success) throw Errors.validation("Invalid data", validatedData.error.message);

        const { headline, description, cta, hashtags, platform, storeId } = validatedData.data;

        return await ContentAIRepository.create({ headline, description, cta, hashtags, platform, storeId });
    },

    async quantity(data: quantityContentAI){
        const validatedData = quantityContentAISchema.safeParse(data);

        if(!validatedData.success) throw Errors.validation("Invalid data", validatedData.error.message);

        const { storeId } = validatedData.data;

        return await ContentAIRepository.quantity({ storeId });
    }
}