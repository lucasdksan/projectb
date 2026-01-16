"use server";

import { AuthService } from "@/backend/modules/auth/auth.service";
import { AppError } from "@/backend/shared/errors/app-error";
import { forgetSchema } from "@/frontend/components/FormForget/schema";

export async function forgetAction(formData: FormData) {
    const rawData = {
        email: formData.get("email"),
    };

    const parsed = forgetSchema.safeParse(rawData);

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
            message: "Dados inválidos",
        };
    }
    
    try {
        const { status } = await AuthService.forgot(parsed.data.email);

        return {
            success: status,
            errors: null,
            message: "E-mail enviado com sucesso",
        }
    } catch (error) {
        return {
            success: false,
            errors: error instanceof AppError ? error.details : null,
            message: error instanceof AppError ? error.message : "Erro ao enviar e-mail",
        };
    }
}