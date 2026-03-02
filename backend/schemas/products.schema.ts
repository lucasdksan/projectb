import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().optional(),
    price: z.number().min(0.01, "Preço é obrigatório"),
    stock: z.number().int().min(0, "Estoque é obrigatório"),
    storeId: z.number().min(1, "Loja é obrigatória"),
    imageUrls: z.array(z.string().url()).optional().default([]),
});

export const listProductsSchema = z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(5),
    search: z.string().optional(),
    storeId: z.number().min(1, "Loja é obrigatória"),
});

export type ListProductsDTO = z.infer<typeof listProductsSchema>;
export type CreateProductDTO = z.infer<typeof createProductSchema>;