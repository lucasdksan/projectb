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

export type createProduct = z.infer<typeof createProductSchema>;