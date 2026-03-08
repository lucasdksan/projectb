import { StoreRepository } from "../repositories/store.repository";
import { UpdateStoreDTO, UpdateConfigStoreDTO } from "../schemas/store.schema";
import { vercelIntegration } from "../intagrations/vercel";

export const StoreService = {
    async getStore(userId: number) {
        return await StoreRepository.getStore(userId);
    },

    async createStore(userId: number, data: UpdateStoreDTO) {
        const slug = data.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s]/g, '')
            .trim()
            .replace(/\s+/g, '-');

        return await StoreRepository.createStore(userId, {
            slug,
            ...data,
        });
    },

    async updateStore(userId: number, data: UpdateStoreDTO) {
        return await StoreRepository.updateStore(userId, data);
    },

    async getStoreId(userId: number) {
        const store = await this.getStore(userId);

        if (!store) {
            return null;
        }

        return store.id;
    },

    async updateConfigStore(userId: number, data: UpdateConfigStoreDTO) {
        const store = await this.getStore(userId);

        if (!store) {
            throw new Error("Loja não encontrada");
        }

        const existingConfig = await StoreRepository.getStore(userId);
        if (existingConfig?.config?.logoUrl && existingConfig.config.logoUrl !== data.logoUrl) {
            try {
                await vercelIntegration.blob.delete(existingConfig.config.logoUrl);
            } catch {
                console.error("Failed to delete old logo from Vercel Blob");
            }
        }

        return await StoreRepository.updateConfigStore(store.id, data);
    },

    async getStoreBySlug(slug: string) {
        return await StoreRepository.getStoreBySlug(slug);
    },
}
