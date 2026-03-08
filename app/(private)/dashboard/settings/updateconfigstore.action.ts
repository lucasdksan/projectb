"use server";

import { getCurrentUser } from "@/libs/auth";
import { StoreController } from "@/backend/controllers/store.controller";
import { updateConfigStoreSchema } from "@/backend/schemas/store.schema";
import { vercelIntegration } from "@/backend/intagrations/vercel";

export type UpdateConfigStoreActionResult =
    | { success: true; data: null; errors: null }
    | { success: false; errors: Record<string, string[] | undefined>; data: null };

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export async function updateConfigStoreAction(
    formData: FormData
): Promise<UpdateConfigStoreActionResult> {
    const primaryColor = formData.get("primaryColor");
    const secondaryColor = formData.get("secondaryColor");
    const logoFile = formData.get("logo");

    const colorValidation = updateConfigStoreSchema
        .omit({ logoUrl: true })
        .safeParse({ primaryColor, secondaryColor });

    if (!colorValidation.success) {
        const fieldErrors = colorValidation.error.flatten().fieldErrors;
        return {
            success: false,
            data: null,
            errors: {
                primaryColor: fieldErrors.primaryColor,
                secondaryColor: fieldErrors.secondaryColor,
            },
        };
    }

    const { primaryColor: validatedPrimaryColor, secondaryColor: validatedSecondaryColor } =
        colorValidation.data;

    let logoUrl = "";
    let hasLogoUpdate = false;

    if (logoFile instanceof File && logoFile.size > 0) {
        hasLogoUpdate = true;
        if (!ACCEPTED_IMAGE_TYPES.includes(logoFile.type)) {
            return {
                success: false,
                data: null,
                errors: { logo: ["Formato inválido. Use JPEG, PNG ou WebP."] },
            };
        }
        if (logoFile.size > MAX_IMAGE_BYTES) {
            return {
                success: false,
                data: null,
                errors: { logo: [`A imagem deve ter no máximo ${MAX_IMAGE_SIZE_MB}MB.`] },
            };
        }
    }

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
        const store = await StoreController.getStore(userId);

        if (!store) {
            return {
                success: false,
                data: null,
                errors: { global: ["Nenhuma loja cadastrada. Cadastre uma loja primeiro."] },
            };
        }

        if (!hasLogoUpdate && !store.config?.logoUrl) {
            return {
                success: false,
                data: null,
                errors: { logo: ["Logo é obrigatória para a primeira vez"] },
            };
        }

        if (hasLogoUpdate && logoFile instanceof File && logoFile.size > 0) {
            logoUrl = await vercelIntegration.blob.upload(logoFile);
        } else if (!hasLogoUpdate && store.config?.logoUrl) {
            logoUrl = store.config.logoUrl;
        }

        await StoreController.updateConfigStore(userId, {
            primaryColor: validatedPrimaryColor,
            secondaryColor: validatedSecondaryColor,
            logoUrl,
        });

        return { success: true, data: null, errors: null };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        return {
            success: false,
            data: null,
            errors: { global: [errorMessage] },
        };
    }
}
