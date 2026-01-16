"use server";

import { signUpSchema } from "@/frontend/components/FormSignUp/schema";
import { AuthService } from "@/backend/modules/auth/auth.service";
import tokenIntoCookies from "@/libs/token";
import { AppError } from "@/backend/shared/errors/app-error";

export async function signUpAction(formData: FormData) {
    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    };

    const parsed = signUpSchema.safeParse(rawData);

    if (!parsed.success) {
        return {
            success: false,
            user: null,
            errors: parsed.error.flatten().fieldErrors,
            message: "Dados inválidos",
        };
    }

    try {
        const body = parsed.data;
        const { token, name, email: userEmail } = await AuthService.create(body);
        await tokenIntoCookies.set(token, process.env.NODE_ENV === "production");

        return {
            success: true,
            user: {
                name,
                email: userEmail,
            },
            errors: null,
            message: "Usuário cadastrado com sucesso",
        };
    } catch (error) {
        return {
            success: false,
            user: null,
            errors: error instanceof AppError ? error.details : null,
            message: error instanceof AppError ? error.message : "Erro ao cadastrar usuário",
        };
    }
}