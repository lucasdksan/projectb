import { z } from "zod";

export const forgetModel = z
    .object({
        email: z.email("Email inválido"),
    });

export type ForgetModelType = z.infer<typeof forgetModel>;