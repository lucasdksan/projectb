import { Errors } from "@/backend/shared/errors/errors";
import { ContentAIRepository } from "./contentAI.repository";
import { createContentAI, createContentAISchema } from "./contentAI.types";

export const ContentAIService = {
    async create(data: createContentAI){
        const validatedData = createContentAISchema.safeParse(data);

        if(!validatedData.success) throw Errors.validation("Invalid data", validatedData.error.message);

        const { headline, description, cta, hashtags, platform, storeId } = validatedData.data;

        return await ContentAIRepository.create({ headline, description, cta, hashtags, platform, storeId });
    }
}