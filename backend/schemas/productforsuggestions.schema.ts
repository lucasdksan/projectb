import z from "zod";

export const productForSuggestionsSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().optional(),
    price: z.number().int().min(0, "Preço deve ser zero ou maior"),
    stock: z.number().int().min(0, "Estoque deve ser zero ou maior"),
});

export type ProductForSuggestionsDTO = z.infer<typeof productForSuggestionsSchema>;

export const productForSuggestionsResponseSchema = z.object({
    suggestion: z.string().min(1),
});

export type ProductForSuggestionsResponse = z.infer<typeof productForSuggestionsResponseSchema>;
