"use server";

import { StoreController } from "@/backend/controllers/store.controller";
import { updateStoreSchema } from "@/backend/schemas/store.schema";
import { getCurrentUser } from "@/libs/auth";

export type UpdateStoreActionResult =
    | { success: true; data: null; errors: null }
    | { success: false; errors: Record<string, string[] | undefined>; data: null };

export async function updateStoreAction(data: unknown): Promise<UpdateStoreActionResult> {
    const parsed = updateStoreSchema.safeParse(data);

    if (!parsed.success) {
        return {
            success: false,
            data: null,
            errors: parsed.error.flatten().fieldErrors as Record<string, string[] | undefined>,
        };
    }

    try {
        const user = await getCurrentUser();

        if (!user) {
            return {
                success: false,
                data: null,
                errors: {
                    global: ["Usuário não autenticado"],
                },
            };
        }

        const userId = typeof user.sub === "string" ? parseInt(user.sub, 10) : user.sub;
        await StoreController.updateStore(userId, parsed.data);

        return {
            success: true,
            data: null,
            errors: null,
        };
    } catch (error) {
        return {
            success: false,
            data: null,
            errors: {
                global: [error instanceof Error ? error.message : "Erro ao atualizar loja"],
            },
        };
    }
}
