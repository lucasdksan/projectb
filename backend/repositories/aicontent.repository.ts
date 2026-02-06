import { prisma } from "../database/prisma";
import { ContentAIResponse, SaveContentDTO } from "../schemas/aicontent.schema";

export const AIContentRepository = {
    async create(data: SaveContentDTO, userId: number): Promise<ContentAIResponse> {
        return await prisma.contentAI.create({
            data: {
                headline: data.headline,
                description: data.description,
                cta: data.cta,
                hashtags: data.hashtags,
                platform: data.platform,
                userId,
            },
        });
    },

    async findByUserId(userId: number, limit: number = 50): Promise<ContentAIResponse[]> {
        return await prisma.contentAI.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
    },

    async findById(id: number, userId: number): Promise<ContentAIResponse | null> {
        return await prisma.contentAI.findFirst({
            where: { id, userId },
        });
    },

    async delete(id: number, userId: number): Promise<boolean> {
        const content = await prisma.contentAI.deleteMany({
            where: { id, userId },
        });

        return content.count > 0;
    },

    async quantity(userId: number): Promise<number> {
        return await prisma.contentAI.count({
            where: { userId },
        });;
    },

    async lastContent(userId: number) {
        return await prisma.contentAI.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 4,
        });
    }
};
