"use server";

import { AuthController } from "@/backend/controllers/auth.controller";
import { createUserSchema } from "@/backend/schemas/auth.schema";
import { env } from "@/libs/env";
import tokenIntoCookies from "@/libs/token";

export type SignupActionResult = 
    | { success: true; data: any }
    | { success: false; errors: Record<string, string[] | undefined> };

export async function signupAction(data: unknown): Promise<SignupActionResult> {
    const parsed = createUserSchema.safeParse(data);

    if (!parsed.success) {
        return {
          success: false,
          errors: parsed.error.flatten().fieldErrors,
        }
    }

    try {
        const { email, name, token } = await AuthController.createUser(parsed.data);
        await tokenIntoCookies.set(token, env.NODE_ENV === "production");


        return {
            success: true,
            data: { email, name },
        };
    } catch (error) {
        return {
            success: false,
            errors: {
                global: [error instanceof Error ? error.message : "Erro ao criar usuário"],
            },
        }
    }
}