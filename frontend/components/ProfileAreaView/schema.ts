import { z } from "zod";

export const profileAreaViewSchema = z
    .object({
        name: z.string().min(2, "Nome muito curto"),
        email: z.string().email("Email inválido"),
    });

export type profileAreaViewSchemaType = z.infer<typeof profileAreaViewSchema>;