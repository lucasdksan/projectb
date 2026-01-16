"use server";

import { signInSchema } from "@/frontend/components/FormSignIn/schema";
import { AuthService } from "@/backend/modules/auth/auth.service";
import tokenIntoCookies from "@/libs/token";
import { AppError } from "@/backend/shared/errors/app-error";

export async function signInAction(formData: FormData) {
    const rawData = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    const parsed = signInSchema.safeParse(rawData);

    if (!parsed.success) {
        return {
            success: false,
            user: null,
            errors: parsed.error.flatten().fieldErrors,
            message: "Dados inválidos",
        };
    }

    try {
        const { token, name, email: userEmail } = await AuthService.signIn(parsed.data);
        await tokenIntoCookies.set(token, process.env.NODE_ENV === "production");

        return { success: true, user: { name, email: userEmail }, errors: null, message: "Login realizado com sucesso" };
    } catch (error) {
        return {
            success: false,
            user: null,
            errors: error instanceof AppError ? error.details : null,
            message: error instanceof AppError ? error.message : "Erro ao fazer login",
        };
    }
}
