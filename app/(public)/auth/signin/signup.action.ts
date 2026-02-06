"use server";

import { AuthController } from "@/backend/controllers/auth.controller";
import { signInSchema } from "@/backend/schemas/auth.schema";
import { env } from "@/libs/env";
import tokenIntoCookies from "@/libs/token";

export type SigninActionResult = 
    | { success: true; data: any }
    | { success: false; errors: Record<string, string[] | undefined> };

export async function signinAction(data: unknown) {
    const parsed = signInSchema.safeParse(data);

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        }
    }

    try {
        const { token, name, email } = await AuthController.signIn(parsed.data);
        await tokenIntoCookies.set(token, env.NODE_ENV === "production");
        return {
            success: true,
            data: { email, name },
        }
    } catch (error) {
        return {
            success: false,
            errors: {
                global: [error instanceof Error ? error.message : "Erro ao fazer login"],
            },
        }
    }
}