import { prisma } from "@/backend/shared/database/prisma";
import { createProduct, updateProduct, quantityProduct } from "./product.types";

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

    async findById(id: number) {
        const product = await prisma.products.findFirst({
            where: {
                id
            },
            include: {
                attributes: true
            }
        });

        return product;
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

    async paginationByStoreId(storeId: number, page: number, limit: number, search?: string) {
        const skip = (page - 1) * limit
        const where = {
            storeId,
            name: search ? { contains: search.toLowerCase() } : undefined
        };

        const [data, total] = await Promise.all([
            prisma.products.findMany({
                where,
                include: { attributes: true },
                skip,
                take: limit
            }),
            prisma.products.count({ where })
        ]);

        return { data, total };
    },

    async update(id: number, data: updateProduct) {
        const { attributes, ...rest } = data;
        const product = await prisma.products.update({
            where: { id },
            data: {
                ...rest,
                attributes: attributes ? {
                    deleteMany: {},
                    create: attributes
                } : undefined,
            },
            include: { attributes: true }
        });

        return product;
    },

    async delete(id: number) {
        return await prisma.products.delete({
            where: { id }
        });
    },

    async quantity(data: quantityProduct){
        const result = await prisma.products.count({
            where: {
                storeId: data.storeId
            }
        });

        return result;
    },

    async quantityLast30Days(data: quantityProduct) {
        const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30
      
        const result = await prisma.products.count({
          where: {
            storeId: data.storeId,
            createdAt: {
              gte: new Date(Date.now() - THIRTY_DAYS)
            }
          }
        })
      
        return result
      }
};
