import { z } from "zod";

export const resetModel = z
    .object({
        email: z.email("Email inválido"),
        token: z.string("Token inválido"),
        password: z.string("Senha inválida").min(8, "Mínimo 8 caracteres"),
        confirmPassword: z.string("Senha inválida"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não conferem",
        path: ["confirmPassword"],
    });

export type ResetModelType = z.infer<typeof resetModel>;