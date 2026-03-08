import { prisma } from "../database/prisma";

export const StoreRepository = {
    async getStore(userId: number){
        return await prisma.store.findFirst({
            where: {
                userId
            },
            include: {
                config: true,
            }
        });
    },

    async createStore(userId: number, data: { slug: string; name: string; email: string; number: string; description: string; typeMarket: string }) {
        return await prisma.store.create({
            data: {
                userId,
                name: data.name,
                email: data.email,
                number: data.number,
                description: data.description,
                typeMarket: data.typeMarket,
                slug: data.slug,
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

    async updateConfigStore(storeId: number, data: { primaryColor: string; secondaryColor: string; logoUrl: string }) {
        return await prisma.configStore.upsert({
            where: { storeId },
            update: {
                primaryColor: data.primaryColor,
                secondaryColor: data.secondaryColor,
                logoUrl: data.logoUrl,
                updatedAt: new Date(),
            },
            create: {
                storeId,
                primaryColor: data.primaryColor,
                secondaryColor: data.secondaryColor,
                logoUrl: data.logoUrl,
            },
        });
    },
}   