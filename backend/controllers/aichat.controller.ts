import {
    SendMessageWithImageInput,
    SendMessageWithoutImageInput,
    SendMessageWithContextInput,
} from "../schemas/aichat.schema";
import { AIChatService } from "../services/aichat.service";

export const AIChatController = {
    async sendMessageWithImage(dto: SendMessageWithImageInput) {
        return await AIChatService.sendMessageWithImage(dto.prompt, dto.image);
    },

    async sendMessageWithoutImage(dto: SendMessageWithoutImageInput) {
        return await AIChatService.sendMessageWithoutImage(dto.prompt);
    },

    async sendMessageWithContext(dto: SendMessageWithContextInput) {
        return await AIChatService.sendMessageWithContext(
            dto.prompt,
            dto.history,
            dto.image,
            dto.platform,
            dto.mode
        );
    },
};
