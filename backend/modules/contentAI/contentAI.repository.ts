import { prisma } from "@/backend/shared/database/prisma";
import { createContentAI } from "./contentAI.types";

export const ContentAIRepository = {
    async create(data: createContentAI){
        return await prisma.contentAI.create({
            data
        });
    }
}