import z from "zod";

export const addProductSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    price: z.number().int().positive(),
    stock: z.number().int().nonnegative(),
    isActive: z.boolean(),
    category: z.string(),
    storeId: z.number(),
    attributes: z.array(z.object({
        type: z.string(),
        value: z.string(),
    })).optional(),
});

export type addProductSchemaType = z.infer<typeof addProductSchema>;