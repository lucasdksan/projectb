"use server";

import { AuthService } from "@/backend/modules/auth/auth.service";
import { resetUserSchema } from "@/backend/modules/auth/auth.types";
import { AppError } from "@/backend/shared/errors/app-error";
import tokenIntoCookies from "@/libs/token";

export async function resetAction(formData: FormData) {
    const rawData = {
        email: formData.get("email"),
        password: formData.get("password"),
        token: formData.get("token"),
    };

    const parsed = resetUserSchema.safeParse(rawData);

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
            message: "Dados inválidos",
        };
    }
    
    try {
        const { status, token } = await AuthService.reset(parsed.data);

        if(!status){
            return {
                success: false,
                errors: {
                    status: ["Status de reset inválido"]
                },
                message: "Status de reset inválido",
            }
        }

        await tokenIntoCookies.set(token, process.env.NODE_ENV === "production");

        return {
            success: status,
            errors: null,
            message: "Senha resetada com sucesso",
        }
    } catch (error) {
        return {
            success: false,
            errors: error instanceof AppError ? error.details : null,
            message: error instanceof AppError ? error.message : "Erro ao resetar senha",
        };
    }
}