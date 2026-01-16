import { z } from "zod";

export const forgetSchema = z
    .object({
        email: z.email("Email inválido"),
    });

export type forgetSchemaType = z.infer<typeof forgetSchema>;