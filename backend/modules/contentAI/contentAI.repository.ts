import { prisma } from "@/backend/shared/database/prisma";
import { createContentAI, quantityContentAI } from "./contentAI.types";

export const ContentAIRepository = {
    async create(data: createContentAI){
        return await prisma.contentAI.create({
            data
        });
    },

    async quantity(data: quantityContentAI){
        const result = await prisma.contentAI.count({
            where: {
                storeId: data.storeId
            }
        });

        return result;
    }
}