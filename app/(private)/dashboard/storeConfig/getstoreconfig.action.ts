"use server";

import { getCurrentUser } from "@/libs/auth";
import { getActionErrorMessage } from "@/libs/action-error";
import { StoreService } from "@/backend/services/store.service";

export interface StoreConfigData {
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
    bannerHeroURL: string | null;
    bannerHeroMobileURL: string | null;
    bannerSecondaryURL: string | null;
    bannerTertiaryURL: string | null;
}

export type GetStoreConfigActionResult =
    | { success: true; data: { config: StoreConfigData | null }; errors: null }
    | { success: false; errors: Record<string, string[] | undefined>; data: null };

export async function getStoreConfigAction(): Promise<GetStoreConfigActionResult> {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return {
                success: false,
                data: null,
                errors: { global: ["Usuário não autenticado"] },
            };
        }

        const userId = typeof user.sub === "string" ? parseInt(user.sub, 10) : user.sub;
        const store = await StoreService.getStore(userId);

        if (!store || !store.config) {
            return {
                success: true,
                data: { config: null },
                errors: null,
            };
        }

        return {
            success: true,
            data: {
                config: {
                    primaryColor: store.config.primaryColor,
                    secondaryColor: store.config.secondaryColor,
                    logoUrl: store.config.logoUrl,
                    bannerHeroURL: store.config.bannerHeroURL ?? null,
                    bannerHeroMobileURL: store.config.bannerHeroMobileURL ?? null,
                    bannerSecondaryURL: store.config.bannerSecondaryURL ?? null,
                    bannerTertiaryURL: store.config.bannerTertiaryURL ?? null,
                },
            },
            errors: null,
        };
    } catch (error) {
        return {
            success: false,
            data: null,
            errors: {
                global: [
                    getActionErrorMessage(
                        error,
                        "Erro ao buscar configurações da loja",
                    ),
                ],
            },
        };
    }
}
