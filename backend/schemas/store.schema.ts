import z from "zod";

export const configStoreSchema = z.object({
    primaryColor: z.string(),
    secondaryColor: z.string(),
    logoUrl: z.string(),
});

export type ConfigStoreDTO = z.infer<typeof configStoreSchema>;

export const getStoreSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    number: z.string().min(1),
    description: z.string().min(1),
    typeMarket: z.string().min(1),
    config: configStoreSchema.nullable().optional(),
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

export const updateConfigStoreSchema = z.object({
    primaryColor: z.string().min(1, "Cor primária é obrigatória").regex(/^#[0-9A-F]{6}$/i, "Formato de cor inválido. Use #RRGGBB"),
    secondaryColor: z.string().min(1, "Cor secundária é obrigatória").regex(/^#[0-9A-F]{6}$/i, "Formato de cor inválido. Use #RRGGBB"),
    logoUrl: z.string().min(1, "Logo é obrigatória"),
});

export type UpdateConfigStoreDTO = z.infer<typeof updateConfigStoreSchema>;