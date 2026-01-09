"use server";

import { signUpSchema } from "@/frontend/components/FormSignUp/schema";
import { AuthService } from "@/backend/modules/auth/auth.service";
import tokenIntoCookies from "@/libs/token";

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
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const body = parsed.data;
    const { token, name, email: userEmail } = await AuthService.create(body);
    await tokenIntoCookies.set(token, process.env.NODE_ENV === "production");

    return {
        success: true,
        name: name,
        email: userEmail,
        message: "Usuário cadastrado com sucesso",
    };
}