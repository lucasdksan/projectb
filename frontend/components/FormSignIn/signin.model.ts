import { z } from "zod";

export const signInModel = z
    .object({
        email: z.string().email("Email inválido"),
        password: z.string().min(8, "Mínimo de 8 caracteres"),
    });

export type SignInModelType = z.infer<typeof signInModel>;