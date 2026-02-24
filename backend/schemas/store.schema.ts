import z from "zod";

export const getStoreSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    number: z.string().min(1),
    description: z.string().min(1),
    typeMarket: z.string().min(1),
});

export type GetStoreDTO = z.infer<typeof getStoreSchema>;

export const updateStoreSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("E-mail inválido"),
    number: z.string().min(1, "Telefone é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    typeMarket: z.string().min(1, "Tipo de mercado é obrigatório"),
});

export type UpdateStoreDTO = z.infer<typeof updateStoreSchema>;