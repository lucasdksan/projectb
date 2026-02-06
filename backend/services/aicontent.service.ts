import { Errors } from "../errors/errors";
import { AIContentRepository } from "../repositories/aicontent.repository";
import { SaveContentDTO, ContentAIResponse } from "../schemas/aicontent.schema";

export const AIContentService = {
    async save(data: SaveContentDTO, userId: number): Promise<ContentAIResponse> {
        return await AIContentRepository.create(data, userId);
    },

    async list(userId: number): Promise<ContentAIResponse[]> {
        return await AIContentRepository.findByUserId(userId);
    },

    async getById(id: number, userId: number): Promise<ContentAIResponse> {
        const content = await AIContentRepository.findById(id, userId);

        if (!content) {
            throw Errors.notFound("Conteúdo não encontrado");
        }

        return content;
    },

    async delete(id: number, userId: number): Promise<boolean> {
        const deleted = await AIContentRepository.delete(id, userId);

        if (!deleted) {
            throw Errors.notFound("Conteúdo não encontrado");
        }

        return true;
    },

    async quantity(userId: number): Promise<number> {
        return await AIContentRepository.quantity(userId);
    },

    async lastContent(userId: number) {
        return await AIContentRepository.lastContent(userId);
    }
};
