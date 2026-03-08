"use server";

import { z } from "zod";
import { getCurrentUser } from "@/libs/auth";
import { StoreController } from "@/backend/controllers/store.controller";
import { updateConfigStoreSchema } from "@/backend/schemas/store.schema";
import { vercelIntegration } from "@/backend/intagrations/vercel";

const updateConfigStoreActionSchema = updateConfigStoreSchema
    .omit({ logoUrl: true })
    .extend({
        primaryColor: z.string().min(1, "Cor primária é obrigatória"),
        secondaryColor: z.string().min(1, "Cor secundária é obrigatória"),
    });

export type UpdateConfigStoreActionResult =
    | { success: true; data: null; errors: null }
    | { success: false; errors: Record<string, string[] | undefined>; data: null };

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

const HEX_COLOR_REGEX = /^#[0-9A-F]{6}$/i;

export async function updateConfigStoreAction(
    formData: FormData
): Promise<UpdateConfigStoreActionResult> {
    const primaryColor = formData.get("primaryColor");
    const secondaryColor = formData.get("secondaryColor");
    const logoFile = formData.get("logo");

    // Validate colors first
    if (!primaryColor || typeof primaryColor !== "string") {
        return {
            success: false,
            data: null,
            errors: {
                primaryColor: ["Cor primária é obrigatória"],
            },
        };
    }

    if (!secondaryColor || typeof secondaryColor !== "string") {
        return {
            success: false,
            data: null,
            errors: {
                secondaryColor: ["Cor secundária é obrigatória"],
            },
        };
    }

    if (!HEX_COLOR_REGEX.test(primaryColor)) {
        return {
            success: false,
            data: null,
            errors: {
                primaryColor: ["Formato de cor inválido. Use #RRGGBB"],
            },
        };
    }

    if (!HEX_COLOR_REGEX.test(secondaryColor)) {
        return {
            success: false,
            data: null,
            errors: {
                secondaryColor: ["Formato de cor inválido. Use #RRGGBB"],
            },
        };
    }

    // Validate logo file
    let logoUrl = "";
    let hasLogoUpdate = false;

    if (logoFile instanceof File && logoFile.size > 0) {
        hasLogoUpdate = true;
        if (!ACCEPTED_IMAGE_TYPES.includes(logoFile.type)) {
            return {
                success: false,
                data: null,
                errors: {
                    logo: [
                        "Formato inválido. Use JPEG, PNG ou WebP.",
                    ],
                },
            };
        }
        if (logoFile.size > MAX_IMAGE_BYTES) {
            return {
                success: false,
                data: null,
                errors: {
                    logo: [`A imagem deve ter no máximo ${MAX_IMAGE_SIZE_MB}MB.`],
                },
            };
        }
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
        const store = await StoreController.getStore(userId);

        if (!store) {
            return {
                success: false,
                data: null,
                errors: {
                    global: [
                        "Nenhuma loja cadastrada. Cadastre uma loja primeiro.",
                    ],
                },
            };
        }

        // Check if config exists and has a logo
        if (!hasLogoUpdate && !store.config?.logoUrl) {
            return {
                success: false,
                data: null,
                errors: {
                    logo: ["Logo é obrigatória para a primeira vez"],
                },
            };
        }

        // Upload logo to Vercel Blob if new file provided
        if (hasLogoUpdate && logoFile instanceof File && logoFile.size > 0) {
            logoUrl = await vercelIntegration.blob.upload(logoFile);
        } else if (!hasLogoUpdate && store.config?.logoUrl) {
            // Keep existing logo URL
            logoUrl = store.config.logoUrl;
        }

        // Call controller to update config store with validation
        await StoreController.updateConfigStore(userId, {
            primaryColor,
            secondaryColor,
            logoUrl,
        });

        return {
            success: true,
            data: null,
            errors: null,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        return {
            success: false,
            data: null,
            errors: {
                global: [errorMessage],
            },
        };
    }
}
