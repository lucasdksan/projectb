"use server";

import { getCurrentUser } from "@/libs/auth";
import { getActionErrorMessage } from "@/libs/action-error";
import { StoreService } from "@/backend/services/store.service";
import { updateConfigStoreSchema } from "@/backend/schemas/store.schema";
import { vercelIntegration } from "@/backend/intagrations/vercel";

export type UpdateStoreConfigActionResult =
    | { success: true; data: null; errors: null }
    | { success: false; errors: Record<string, string[] | undefined>; data: null };

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

function validateImageFile(
    file: FormDataEntryValue | null,
    fieldName: string
): { error: UpdateStoreConfigActionResult } | { file: File } | null {
    if (!(file instanceof File) || file.size === 0) return null;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        return { error: { success: false, data: null, errors: { [fieldName]: ["Formato inválido. Use JPEG, PNG ou WebP."] } } };
    }
    if (file.size > MAX_IMAGE_BYTES) {
        return { error: { success: false, data: null, errors: { [fieldName]: [`A imagem deve ter no máximo ${MAX_IMAGE_SIZE_MB}MB.`] } } };
    }
    return { file };
}

export async function updateStoreConfigAction(
    formData: FormData
): Promise<UpdateStoreConfigActionResult> {
    const primaryColor = formData.get("primaryColor");
    const secondaryColor = formData.get("secondaryColor");

    const colorValidation = updateConfigStoreSchema
        .omit({
            logoUrl: true,
            bannerHeroURL: true,
            bannerHeroMobileURL: true,
            bannerSecondaryURL: true,
            bannerTertiaryURL: true,
        })
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

    const logoFile = formData.get("logo");
    const bannerHeroFile = formData.get("bannerHero");
    const bannerHeroMobileFile = formData.get("bannerHeroMobile");
    const bannerSecondaryFile = formData.get("bannerSecondary");
    const bannerTertiaryFile = formData.get("bannerTertiary");

    const logoValidation = validateImageFile(logoFile, "logo");
    if (logoValidation && "error" in logoValidation) return logoValidation.error;

    const bannerHeroValidation = validateImageFile(bannerHeroFile, "bannerHero");
    if (bannerHeroValidation && "error" in bannerHeroValidation) return bannerHeroValidation.error;

    const bannerHeroMobileValidation = validateImageFile(bannerHeroMobileFile, "bannerHeroMobile");
    if (bannerHeroMobileValidation && "error" in bannerHeroMobileValidation) return bannerHeroMobileValidation.error;

    const bannerSecondaryValidation = validateImageFile(bannerSecondaryFile, "bannerSecondary");
    if (bannerSecondaryValidation && "error" in bannerSecondaryValidation) return bannerSecondaryValidation.error;

    const bannerTertiaryValidation = validateImageFile(bannerTertiaryFile, "bannerTertiary");
    if (bannerTertiaryValidation && "error" in bannerTertiaryValidation) return bannerTertiaryValidation.error;

    try {
        const user = await getCurrentUser();

        if (!user) {
            return { success: false, data: null, errors: { global: ["Usuário não autenticado"] } };
        }

        const userId = typeof user.sub === "string" ? parseInt(user.sub, 10) : user.sub;
        const store = await StoreService.getStore(userId);

        if (!store) {
            return {
                success: false,
                data: null,
                errors: { global: ["Nenhuma loja cadastrada. Cadastre uma loja primeiro."] },
            };
        }

        const hasLogoFile = logoValidation && "file" in logoValidation;
        if (!hasLogoFile && !store.config?.logoUrl) {
            return {
                success: false,
                data: null,
                errors: { logo: ["Logo é obrigatória para a primeira vez"] },
            };
        }

        let logoUrl = store.config?.logoUrl ?? "";
        if (hasLogoFile) {
            logoUrl = await vercelIntegration.blob.upload(logoValidation.file);
        }

        const bannerHeroClear = formData.get("bannerHeroClear") === "true";
        const bannerHeroMobileClear = formData.get("bannerHeroMobileClear") === "true";
        const bannerSecondaryClear = formData.get("bannerSecondaryClear") === "true";
        const bannerTertiaryClear = formData.get("bannerTertiaryClear") === "true";

        let bannerHeroURL: string | null = bannerHeroClear ? null : (store.config?.bannerHeroURL ?? null);
        let bannerHeroMobileURL: string | null = bannerHeroMobileClear ? null : (store.config?.bannerHeroMobileURL ?? null);
        let bannerSecondaryURL: string | null = bannerSecondaryClear ? null : (store.config?.bannerSecondaryURL ?? null);
        let bannerTertiaryURL: string | null = bannerTertiaryClear ? null : (store.config?.bannerTertiaryURL ?? null);

        if (bannerHeroValidation && "file" in bannerHeroValidation) {
            bannerHeroURL = await vercelIntegration.blob.upload(bannerHeroValidation.file);
        }
        if (bannerHeroMobileValidation && "file" in bannerHeroMobileValidation) {
            bannerHeroMobileURL = await vercelIntegration.blob.upload(bannerHeroMobileValidation.file);
        }
        if (bannerSecondaryValidation && "file" in bannerSecondaryValidation) {
            bannerSecondaryURL = await vercelIntegration.blob.upload(bannerSecondaryValidation.file);
        }
        if (bannerTertiaryValidation && "file" in bannerTertiaryValidation) {
            bannerTertiaryURL = await vercelIntegration.blob.upload(bannerTertiaryValidation.file);
        }

        await StoreService.updateConfigStore(userId, {
            primaryColor: validatedPrimaryColor,
            secondaryColor: validatedSecondaryColor,
            logoUrl,
            bannerHeroURL,
            bannerHeroMobileURL,
            bannerSecondaryURL,
            bannerTertiaryURL,
        });

        return { success: true, data: null, errors: null };
    } catch (error) {
        return {
            success: false,
            data: null,
            errors: {
                global: [getActionErrorMessage(error, "Erro desconhecido")],
            },
        };
    }
}
