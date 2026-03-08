"use server";

import { getCurrentUser } from "@/libs/auth";
import { StoreController } from "@/backend/controllers/store.controller";
import type { GetStoreDTO } from "@/backend/schemas/store.schema";

export type GetStoreActionResult =
    | { success: true; data: { store: GetStoreDTO | null }; errors: null }
    | { success: false; errors: Record<string, string[] | undefined>; data: null };

export async function getStoreAction(): Promise<GetStoreActionResult> {
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
        const store = await StoreController.getStore(userId);

        return {
            success: true,
            data: {
                store: store
                    ? {
                          name: store.name,
                          email: store.email,
                          number: store.number,
                          description: store.description,
                          typeMarket: store.typeMarket,
                          config: store.config
                              ? {
                                    primaryColor: store.config.primaryColor,
                                    secondaryColor: store.config.secondaryColor,
                                    logoUrl: store.config.logoUrl,
                                }
                              : null,
                      }
                    : null,
            },
            errors: null,
        };
    } catch (error) {
        return {
            success: false,
            data: null,
            errors: {
                global: [error instanceof Error ? error.message : "Erro ao buscar loja"],
            },
        };
    }
}
