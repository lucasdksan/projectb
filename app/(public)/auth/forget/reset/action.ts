"use server";

import { AuthService } from "@/backend/modules/auth/auth.service";
import { resetUserSchema } from "@/backend/modules/auth/auth.types";
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
        };
    }
    
    try {
        const { status, token } = await AuthService.reset(parsed.data);

        if(!status){
            return {
                success: false,
                errors: { email: ["falha no reset"] }
            }
        }

        await tokenIntoCookies.set(token, process.env.NODE_ENV === "production");

        return {
            success: status,
            errors: null,
        }
    } catch (error) {
        console.log(error);

        return {
            success: false,
            errors: { email: [(error as Error).message] },
        };
    }
}