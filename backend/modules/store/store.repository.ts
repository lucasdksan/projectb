import { prisma } from "@/backend/shared/database/prisma";
import { createStore } from "./store.types";

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
    }
};