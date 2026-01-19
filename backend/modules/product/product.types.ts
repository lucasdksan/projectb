import z from "zod";

export const createProductSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    price: z.number().int().positive(),
    stock: z.number().int().nonnegative(),
    isActive: z.boolean(),
    category: z.string(),
    storeId: z.number(),
    attributes: z.array(
        z.object({
            value: z.string(),
            kindof: z.string(),
        })
    ).optional(),
});

export const updateProductSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional().nullable(),
    price: z.number().int().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    isActive: z.boolean().optional(),
    category: z.string().optional(),
    attributes: z.array(
        z.object({
            value: z.string(),
            kindof: z.string(),
        })
    ).optional(),
});

export const paginationProductsSchema = z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    storeId: z.number(),
    search: z.string().optional(),
});

export const productSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable().optional(),
    price: z.number().int().positive(),
    stock: z.number().int().nonnegative(),
    isActive: z.boolean(),
    category: z.string(),
    attributes: z.array(
        z.object({
            value: z.string(),
            kindof: z.string(),
        })
    ).nullable().optional(),
    createdAt: z.date(),
});

export type createProduct = z.infer<typeof createProductSchema>;
export type paginationProducts = z.infer<typeof paginationProductsSchema>;
export type product = z.infer<typeof productSchema>;
export type updateProduct = z.infer<typeof updateProductSchema>;