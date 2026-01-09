import { z } from "zod";

export const signUpSchema = z
    .object({
        name: z.string().min(2, "Nome muito curto"),
        email: z.string().email("Email inválido"),
        password: z.string().min(8, "Mínimo de 8 caracteres"),
        confirmPassword: z.string().min(8),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não conferem",
        path: ["confirmPassword"],
    });

export type signUpSchemaType = z.infer<typeof signUpSchema>;