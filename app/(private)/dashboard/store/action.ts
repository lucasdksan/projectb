"use server";

import { StoreService } from "@/backend/modules/store/store.service";
import { createInstagramConfigSchema } from "@/backend/modules/store/store.types";
import { AppError } from "@/backend/shared/errors/app-error";

export async function addInstagramConfigAction(formData: FormData) {
    const token = formData.get("token");
    const userInstagramId = formData.get("userInstagramId");
    const storeId = formData.get("storeId");

    const rawData = {
        token: token?.toString(),
        userInstagramId: userInstagramId?.toString(),
        storeId: storeId ? parseInt(storeId.toString()) : -1,
    };

    try {
        const parsed = createInstagramConfigSchema.safeParse(rawData); 

        if (!parsed.success) {
            return {
                success: false,
                errors: parsed.error.flatten().fieldErrors,
                instagramConfig: null,
                message: "Dados inválidos"
            };
        }

        const instagramConfig = await StoreService.createInstagramConfig(parsed.data);

        return {
            success: true,
            instagramConfig,
            errors: null,
            message: "Instagram config created successfully",
        };
    } catch (error) {
        return {
            success: false,
            instagramConfig: null,
            errors: error instanceof AppError ? error.details : null,
            message: error instanceof AppError ? error.message : "Erro ao criar configuração do Instagram",
        };
    }
}

export async function getInstagramConfigAction(storeId: number) {
    try {
        const instagramConfig = await StoreService.findInstagramConfigByStoreId(storeId);

        return {
            success: true,
            instagramConfig,
            errors: null,
            message: "Configuração do Instagram encontrada com sucesso",
        };
    } catch (error) {
        return {
            success: false,
            instagramConfig: null,
            errors: error instanceof AppError ? error.details : null,
            message: error instanceof AppError ? error.message : "Erro ao buscar configuração do Instagram",
        };
    }
}