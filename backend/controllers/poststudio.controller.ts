import { PostStudioDTO } from "../schemas/poststudio.schema";
import { PostStudioService } from "../services/poststudio.service";

export const PostStudioController = {
    async generateContent(dto: PostStudioDTO) {
        return await PostStudioService.generateContent(dto);
    }
}