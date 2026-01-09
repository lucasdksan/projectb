"use server";

import { AuthService } from "@/backend/modules/auth/auth.service";
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
        };
    }
    
    try {
        const { status } = await AuthService.forgot(parsed.data.email);

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