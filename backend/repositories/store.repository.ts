import { prisma } from "../database/prisma";

export const StoreRepository = {
    async getStore(userId: number){
        return await prisma.store.findFirst({
            where: {
                userId
            }
        });
    },

    async createStore(userId: number, data: { name: string; email: string; number: string; description: string; typeMarket: string }) {
        return await prisma.store.create({
            data: {
                userId,
                name: data.name,
                email: data.email,
                number: data.number,
                description: data.description,
                typeMarket: data.typeMarket,
            },
        });
    },

    async updateStore(userId: number, data: { name: string; email: string; number: string; description: string; typeMarket: string }) {
        return await prisma.store.updateMany({
            where: { userId },
            data: {
                name: data.name,
                email: data.email,
                number: data.number,
                description: data.description,
                typeMarket: data.typeMarket,
                updatedAt: new Date(),
            },
        });
    },
}   