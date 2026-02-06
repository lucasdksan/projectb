import { SaveContentDTO } from "../schemas/aicontent.schema";
import { AIContentService } from "../services/aicontent.service";

export const AIContentController = {
    async save(dto: SaveContentDTO, userId: number) {
        return await AIContentService.save(dto, userId);
    },

    async list(userId: number) {
        return await AIContentService.list(userId);
    },

    async getById(id: number, userId: number) {
        return await AIContentService.getById(id, userId);
    },

    async delete(id: number, userId: number) {
        return await AIContentService.delete(id, userId);
    },

    async quantity(userId: number) {
        return await AIContentService.quantity(userId);
    },

    async lastContent(userId: number) {
        return await AIContentService.lastContent(userId);
    },
};
