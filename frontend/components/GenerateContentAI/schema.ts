import { z } from "zod";

export const generateContentAISchema = z.object({
    name: z.string().min(2, "Nome muito curto"),
    category: z.string().min(2, "Categoria muito curta"),
    attributes: z.array(z.object({
        kindof: z.string().min(2, "Tipo muito curto"),
        value: z.string().min(2, "Valor muito curto"),
    })),
    price: z.number().int().positive("Preço é obrigatório"),
    platform: z.string().min(2, "Plataforma muito curta"),
});

export type generateContentAISchemaType = z.infer<typeof generateContentAISchema>;