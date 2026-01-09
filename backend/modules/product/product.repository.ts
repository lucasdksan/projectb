import { prisma } from "@/backend/shared/database/prisma";
import { createProduct } from "./product.types";

export const ProductRepository = {
    async create(data: createProduct){
        const product = await prisma.products.create({
            data: {
                ...data,
                attributes: data.attributes ? { create: data.attributes } : undefined,
            }
        });

        return product;
    },

    async findByStoreId(storeId: number){
        const store = await prisma.store.findFirst({
            where: {
                id: storeId
            }
        });

        return store;
    }
};