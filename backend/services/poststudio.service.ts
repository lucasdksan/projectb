import { aiIntegration } from "../integrations/ai";
import { PostStudioChatGenerateDTO, PostStudioDTO } from "../schemas/poststudio.schema";

function buildContextFromChat(dto: PostStudioChatGenerateDTO): string {
    const extra = dto.extraNotes?.trim();
    const extraBlock = extra ? `\n\nInstruções extras do cliente:\n${extra}` : "";

    if (dto.mode === "free") {
        const base = dto.freeText?.trim() ?? "";
        return base + extraBlock;
    }
    const g = dto.guidedAnswers;
    if (!g) return extraBlock.trim();
    const lines = [
        `Tipo de imagem: ${g.imageType}`,
        `Propósito: ${g.purpose}`,
        `Emoção / tom: ${g.emotion}`,
        `Referências estéticas: ${g.aestheticRef}`,
        `Formato / proporção: ${g.aspectRatio}`,
        `Ângulo / ponto de vista: ${g.shotAngle}`,
        `Distância / enquadramento: ${g.shotDistance}`,
        `Luz / atmosfera: ${g.lightingFeel}`,
    ];
    return lines.join("\n") + extraBlock;
}

export const PostStudioService = {
    async generateContent(dto: PostStudioDTO) {
        return await aiIntegration.generateReadyPost(dto.headline, dto.style, dto.image, dto.customContext);
    },

    async generateFromChat(dto: PostStudioChatGenerateDTO) {
        const context = buildContextFromChat(dto);
        if (dto.outputType === "prompt") {
            return await aiIntegration.generatePostStudioChatPrompt(context, dto.image);
        }
        return await aiIntegration.generatePostStudioChatImage(dto.image, context);
    },
};