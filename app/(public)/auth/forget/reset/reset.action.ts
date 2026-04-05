"use server";

import { getActionErrorMessage } from "@/libs/action-error";
import { AuthService } from "@/backend/services/auth.service";
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

        const result = await AuthService.reset({
            email: email!,
            token: token!,
            password: password!,
        });

        if (!result.status) {
            return {
                success: false,
                errors: {
                    global: ["Erro ao resetar senha"],
                },
            }
        }

        await tokenIntoCookies.set(result.token, result.refreshToken, process.env.NODE_ENV === "production");

        return {
            success: true,
        }

    } catch (error) {
        return {
            success: false,
            errors: {
                global: [
                    getActionErrorMessage(error, "Erro ao resetar senha"),
                ],
            },
        }
    }
}