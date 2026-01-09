import { z } from "zod";

export const storeUpdateAreaViewSchema = z.object({
    name: z.string().min(2, "Nome muito curto"),
    email: z.string().email("Email inválido"),
    number: z.string(),
    id: z.string(),
});

export type storeUpdateAreaViewSchemaType = z.infer<typeof storeUpdateAreaViewSchema>;