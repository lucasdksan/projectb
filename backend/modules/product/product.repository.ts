import { prisma } from "@/backend/shared/database/prisma";
import { createProduct } from "./product.types";

export const ProductRepository = {
    async create(data: createProduct) {
        const product = await prisma.products.create({
            data: {
                ...data,
                attributes: data.attributes ? { create: data.attributes } : undefined,
            }
        });

        return product;
    },

    async findByStoreId(storeId: number) {
        const store = await prisma.store.findFirst({
            where: {
                id: storeId
            }
        });

        return store;
    },

    async listByStoreId(storeId: number) {
        const products = await prisma.products.findMany({
            where: {
                storeId
            },
            include: {
                attributes: true
            }
        });

        return products;
    },

    async paginationByStoreId(storeId: number, page: number, limit: number) {
        const skip = (page - 1) * limit

        const [data, total] = await Promise.all([
            prisma.products.findMany({
                where: { storeId },
                include: { attributes: true },
                skip,
                take: limit
            }),
            prisma.products.count({
                where: { storeId }
            })
        ]);

        return { data, total };
    }
};