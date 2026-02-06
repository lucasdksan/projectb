"use server";

import { UserController } from "@/backend/controllers/user.controller";
import { updateUserSchema } from "@/backend/schemas/user.schema";
import { getCurrentUser } from "@/libs/auth";
import { env } from "@/libs/env";
import tokenIntoCookies from "@/libs/token";

export type UpdateUserActionResult = 
    | { success: true; data: { name: string } }
    | { success: false; errors: Record<string, string[] | undefined> };

export async function updateUserAction(data: unknown): Promise<UpdateUserActionResult> {
    const parsed = updateUserSchema.safeParse(data);

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        }
    }

    try {
        const user = await getCurrentUser();

        if (!user) {
            return {
                success: false,
                errors: {
                    global: ["Usuário não autenticado"],
                },
            };
        }

        const userId = typeof user.sub === "string" ? parseInt(user.sub, 10) : user.sub;
        const { token, name } = await UserController.updateUser(parsed.data, userId);

        await tokenIntoCookies.set(token, env.NODE_ENV === "production");

        return {
            success: true,
            data: { name },
        }
        
    } catch (error) {
        return {
            success: false,
            errors: {
                global: [error instanceof Error ? error.message : "Erro ao atualizar usuário"],
            },
        }
    }
}
