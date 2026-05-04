import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().optional(),
    price: z.number().int().min(1, "Preço é obrigatório"),
    stock: z.number().int().min(0, "Estoque é obrigatório"),
    storeId: z.number().min(1, "Loja é obrigatória"),
    imageUrls: z.array(z.string().url()).optional().default([]),
});

export const listProductsSchema = z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(5),
    search: z.string().optional(),
    storeId: z.number().min(1, "Loja é obrigatória"),
    activeOnly: z.boolean().optional().default(false),
});

export const listProductsByStoreSlugSchema = z.object({
    storeSlug: z.string().min(1, "Slug da loja é obrigatório"),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(20).default(10),
    search: z.string().optional(),
});

export const updateProductSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().optional(),
    price: z.number().int().min(1, "Preço é obrigatório"),
    stock: z.number().int().min(0, "Estoque é obrigatório"),
    imageUrls: z.array(z.string().url()).optional().default([]),
    isActive: z.boolean().optional().default(true),
});

export type ListProductsDTO = z.infer<typeof listProductsSchema>;
export type ListProductsByStoreSlugDTO = z.infer<typeof listProductsByStoreSlugSchema>;
export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;