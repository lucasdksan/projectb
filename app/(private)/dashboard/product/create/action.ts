"use server";

import { StoreService } from "@/backend/modules/store/store.service";

export async function addProductAction(formData: FormData) {

}

export async function searchStore(userId: string){
    try {
        const store = await StoreService.findByUserId(userId);

        if(!store) return {
            success: false,
            store: null,
            message: "O usuário não possui loja cadastrada"
        };

        return {
            success: true,
            store,
            message: "Loja identificada com sucesso."
        };
        
    } catch (error) {
        return {
            success: false,
            store: null,
            message: "O usuário não possui loja cadastrada"
        };
    }
}