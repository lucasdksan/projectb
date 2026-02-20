import { aiIntegration } from "../intagrations/ai";
import { PostStudioDTO } from "../schemas/poststudio.schema";

export const PostStudioService = {
    async generateContent(dto: PostStudioDTO) {
        return await aiIntegration.generateReadyPost(dto.headline, dto.style, dto.image, dto.customContext);
    }
}