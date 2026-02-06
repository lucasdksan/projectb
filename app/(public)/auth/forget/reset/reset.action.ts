"use server";

import { AuthController } from "@/backend/controllers/auth.controller";
import { resetUserSchema } from "@/backend/schemas/auth.schema";
import tokenIntoCookies from "@/libs/token";

export type ResetActionResult = 
    | { success: true }
    | { success: false; errors: Record<string, string[] | undefined> };

export async function resetAction(data: unknown): Promise<ResetActionResult> {
    const parsed = resetUserSchema.safeParse(data);

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        }
    }

    try {
        const { email, token, password } = parsed.data;

        const user = await AuthController.reset({ email: email!, token: token!, password: password! });

        if (!user.status) {
            return {
                success: false,
                errors: {
                    global: ["Erro ao resetar senha"],
                },
            }
        }

        await tokenIntoCookies.set(user.token, process.env.NODE_ENV === "production");

        return {
            success: true,
        }

    } catch (error) {
        return {
            success: false,
            errors: {
                global: [error instanceof Error ? error.message : "Erro ao resetar senha"],
            },
        }
    }
}