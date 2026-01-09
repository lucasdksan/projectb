"use server";

import { StoreService } from "@/backend/modules/store/store.service";
import { createStoreSchema } from "@/backend/modules/store/store.types";

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
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    try {
        const store = await StoreService.create(parsed.data);

        return { success: true, store, erroos: null };
    } catch (error) {
        console.log(error);

        return {
            success: false,
            store: null,
            errors: { email: ["Credenciais inválidas"] },
        };
    }
}1