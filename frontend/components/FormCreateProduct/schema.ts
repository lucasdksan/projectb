import z from "zod";

export const addProductSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().optional().nullable(),
    price: z.number().int().positive("Preço é obrigatório"),
    stock: z.number().int().nonnegative("Estoque é obrigatório"),
    isActive: z.boolean(),
    category: z.string().min(1, "Categoria é obrigatório"),
    storeId: z.number(),
    attributes: z.array(z.object({
        kindof: z.string().min(1, "Tipo é obrigatório"),
        value: z.string().min(1, "Valor é obrigatório"),
    })).optional(),
});

export type addProductSchemaType = z.infer<typeof addProductSchema>;