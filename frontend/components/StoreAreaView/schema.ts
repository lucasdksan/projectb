import { z } from "zod";

export const storeAreaViewSchema = z
    .object({
        name: z.string().min(2, "Nome muito curto"),
        email: z.string().email("Email inválido"),
        number: z.string(),
        userId: z.string(),
    });

export type storeAreaViewSchemaType = z.infer<typeof storeAreaViewSchema>;