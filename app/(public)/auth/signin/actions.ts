"use server";

import { signInSchema } from "@/frontend/components/FormSignIn/schema";
import { AuthService } from "@/backend/modules/auth/auth.service";
import tokenIntoCookies from "@/libs/token";

export async function signInAction(formData: FormData) {
    const rawData = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    const parsed = signInSchema.safeParse(rawData);

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    try {
        const { token, name, email: userEmail } = await AuthService.signIn(parsed.data);
        await tokenIntoCookies.set(token, process.env.NODE_ENV === "production");

        return { success: true, name: name, email: userEmail };
    } catch (error) {
        return {
            success: false,
            errors: { email: ["Credenciais inválidas"] },
        };
    }
}
