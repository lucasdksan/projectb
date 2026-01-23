import { prisma } from "@/backend/shared/database/prisma";
import { createInstagramConfig, createStore } from "./store.types";

export const StoreRepository = {
    async create(data: createStore){
        const store = await prisma.store.create({
            data
        });

        return store;
    },

    async findByUserId(userId: number){
        return await prisma.store.findFirst({
            where: { userId }
        });
    },

    async createInstagramConfig(data: createInstagramConfig){
        return await prisma.instagramConfig.create({
            data
        });
    },

    async findInstagramConfigByStoreId(storeId: number){
        return await prisma.instagramConfig.findFirst({
            where: { storeId }
        });
    }
};