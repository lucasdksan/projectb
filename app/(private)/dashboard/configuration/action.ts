"use server";

import { StoreService } from "@/backend/modules/store/store.service";
import { createStoreSchema } from "@/backend/modules/store/store.types";
import { AppError } from "@/backend/shared/errors/app-error";

export async function addStoreAction(formData: FormData) {
    const userId = formData.get("userId");
    const rawData = {
        email: formData.get("email"),
        name: formData.get("name"),
        number: formData.get("number"),
        userId: userId ? parseInt(userId.toString()) : -1,
    };

    const parsed = createStoreSchema.safeParse(rawData);

    if (!parsed.success) {
        return {
            success: false,
            store: null,
            errors: parsed.error.flatten().fieldErrors,
            message: "Dados inválidos",
        };
    }

    try {
        const store = await StoreService.create(parsed.data);

        return { success: true, store, errors: null, message: "Loja cadastrada com sucesso" };
    } catch (error) {
        return {
            success: false,
            store: null,
            errors: error instanceof AppError ? error.details : null,
            message: error instanceof AppError ? error.message : "Erro ao cadastrar loja",
        };
    }
}1