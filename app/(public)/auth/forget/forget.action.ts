"use server";

import { getActionErrorMessage } from "@/libs/action-error";
import { AuthService } from "@/backend/services/auth.service";
import { forgetSchema } from "@/backend/schemas/auth.schema";

export type ForgetActionResult = 
    | { success: true; message: string }
    | { success: false; errors: Record<string, string[] | undefined> };

export async function forgetAction(data: unknown): Promise<ForgetActionResult> {
    const parsed = forgetSchema.safeParse(data);

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        }
    }

    try {
        const { email } = parsed.data;

        const user = await AuthService.forgot(email!);
        
        if (!user.status) {
            return {
                success: false,
                errors: {
                    global: ["Erro ao esquecer a senha"],
                },
            }
        }

        return {
            success: true,
            message: "Email enviado com sucesso",
        }
    } catch (error) {
        return {
            success: false,
            errors: {
                global: [
                    getActionErrorMessage(error, "Erro ao esquecer a senha"),
                ],
            },
        }
    }
}