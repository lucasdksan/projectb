import { prisma } from "../database/prisma";
import { CreateProductDTO } from "../schemas/products.schema";

export const ProductsRepository = {
    async createProduct(dto: CreateProductDTO, storeId: number) {
        const { imageUrls = [], ...productData } = dto;
        return await prisma.products.create({
            data: {
                ...productData,
                storeId,
                images:
                    imageUrls.length > 0
                        ? {
                              create: imageUrls.map((url) => ({ url })),
                          }
                        : undefined,
            },
            include: {
                images: true,
            },
        });
    },

    async quantityProducts(storeId: number) {
        return await prisma.products.count({
            where: {
                storeId,
            },
        });
    },
};