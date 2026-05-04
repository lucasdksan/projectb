import { prisma } from "../database/prisma";
import { CreateProductDTO, ListProductsDTO, UpdateProductDTO } from "../schemas/products.schema";

export const ProductsRepository = {
    async slugExistsInStore(storeId: number, slug: string) {
        const count = await prisma.products.count({
            where: { storeId, slug },
        });
        return count > 0;
    },

    async createProduct(dto: { slug: string } &CreateProductDTO, storeId: number) {
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
        const { page, limit, search, storeId, activeOnly } = dto;

        const skip = (page - 1) * limit;

        const whereCondition = {
            storeId,
            ...(activeOnly && { isActive: true }),
            ...(search && search.trim() && {
                OR: [
                    { name: { contains: search.trim() } },
                    { description: { contains: search.trim() } },
                ],
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

    async findManyByIds(ids: number[]) {
        if (ids.length === 0) return [];
        return await prisma.products.findMany({
            where: { id: { in: ids } },
            include: { images: true },
        });
    },

    async getProductById(id: number) {
        return await prisma.products.findUnique({
            where: {
                id: id,
            },
            include: {
                images: true,
            },
        });
    },

    async getProductByStoreSlugAndProductSlug(
        storeSlug: string,
        productSlug: string
    ) {
        const store = await prisma.store.findUnique({
            where: { slug: storeSlug },
        });
        if (!store) return null;

        return await prisma.products.findFirst({
            where: {
                storeId: store.id,
                slug: productSlug,
                isActive: true,
            },
            include: {
                images: true,
            },
        });
    },

    async updateProduct(productId: number, storeId: number, dto: UpdateProductDTO) {
        const { imageUrls = [], ...productData } = dto;

        const product = await prisma.products.findFirst({
            where: { id: productId, storeId },
        });

        if (!product) return null;

        return await prisma.$transaction(async (tx) => {
            if (imageUrls.length > 0) {
                await tx.productImages.deleteMany({
                    where: { productId },
                });
            }

            return await tx.products.update({
                where: { id: productId },
                data: {
                    ...productData,
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
        });
    },

    async deleteProduct(productId: number, storeId: number) {
        const product = await prisma.products.findFirst({
            where: { id: productId, storeId },
        });

        if (!product) return false;

        await prisma.$transaction(async (tx) => {
            await tx.productImages.deleteMany({
                where: { productId },
            });
            await tx.products.delete({
                where: { id: productId },
            });
        });

        return true;
    },
};