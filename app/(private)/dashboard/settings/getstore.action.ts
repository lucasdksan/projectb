"use server";

import { getCurrentUser } from "@/libs/auth";
import { getActionErrorMessage } from "@/libs/action-error";
import { StoreService } from "@/backend/services/store.service";
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
        const store = await StoreService.getStore(userId);

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
                                    bannerHeroURL: store.config.bannerHeroURL ?? null,
                                    bannerSecondaryURL: store.config.bannerSecondaryURL ?? null,
                                    bannerTertiaryURL: store.config.bannerTertiaryURL ?? null,
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
                global: [
                    getActionErrorMessage(error, "Erro ao buscar loja"),
                ],
            },
        };
    }
}
