import { prisma } from "../database/prisma";
import { CreateProductDTO, ListProductsDTO } from "../schemas/products.schema";

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

    async listProducts(dto: ListProductsDTO) {
        const { page, limit, search, storeId } = dto;

        const skip = (page - 1) * limit;

        const whereCondition = {
            storeId,
            ...(search && {
                name: {
                    contains: search,
                },
            }),
        };

        const [products, total] = await Promise.all([
            prisma.products.findMany({
                where: whereCondition,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    images: true,
                },
            }),
            prisma.products.count({
                where: whereCondition,
            }),
        ]);

        return {
            data: products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    async getProduct(slug: number) {
        return await prisma.products.findUnique({
            where: {
                id: slug,
            },
            include: {
                images: true,
            },
        });
    },
};