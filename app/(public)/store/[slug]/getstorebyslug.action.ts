"use server";

import { StoreController } from "@/backend/controllers/store.controller";
import type { GetStoreDTO } from "@/backend/schemas/store.schema";

export type GetStoreBySlugActionResult =
    | { success: true; data: { store: GetStoreDTO }; errors: null }
    | { success: false; data: null; errors: Record<string, string[] | undefined> };

export async function getStoreBySlugAction(
    slug: string
): Promise<GetStoreBySlugActionResult> {
    try {
        const trimmedSlug = slug?.trim();

        if (!trimmedSlug) {
            return {
                success: false,
                data: null,
                errors: {
                    slug: ["Slug é obrigatório"],
                },
            };
        }

        const store = await StoreController.getStoreBySlug(trimmedSlug);

        if (!store) {
            return {
                success: false,
                data: null,
                errors: {
                    global: ["Loja não encontrada"],
                },
            };
        }

        return {
            success: true,
            data: {
                store: {
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
                },
            },
            errors: null,
        };
    } catch (error) {
        console.error("Erro ao buscar loja por slug:", error);
        return {
            success: false,
            data: null,
            errors: {
                global: [
                    error instanceof Error ? error.message : "Erro ao buscar loja",
                ],
            },
        };
    }
}