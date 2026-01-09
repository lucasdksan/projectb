import { z } from "zod";

export const resetSchema = z
    .object({
        email: z.string().email("Email inválido"),
        token: z.string(),
        password: z.string().min(8, "Mínimo de 8 caracteres"),
        confirmPassword: z.string().min(8),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não conferem",
        path: ["confirmPassword"],
    });

export type resetSchemaType = z.infer<typeof resetSchema>;