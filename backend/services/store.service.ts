import { StoreRepository } from "../repositories/store.repository";
import { UpdateStoreDTO, UpdateConfigStoreDTO } from "../schemas/store.schema";
import { vercelIntegration } from "../integrations/vercel";

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
        const config = existingConfig?.config;

        if (config?.logoUrl && config.logoUrl !== data.logoUrl) {
            try {
                await vercelIntegration.blob.delete(config.logoUrl);
            } catch {
                console.error("Failed to delete old logo from Vercel Blob");
            }
        }
        if (config?.bannerHeroURL && config.bannerHeroURL !== data.bannerHeroURL) {
            try {
                await vercelIntegration.blob.delete(config.bannerHeroURL);
            } catch {
                console.error("Failed to delete old banner hero from Vercel Blob");
            }
        }
        if (config?.bannerHeroMobileURL && config.bannerHeroMobileURL !== data.bannerHeroMobileURL) {
            try {
                await vercelIntegration.blob.delete(config.bannerHeroMobileURL);
            } catch {
                console.error("Failed to delete old banner hero mobile from Vercel Blob");
            }
        }
        if (config?.bannerSecondaryURL && config.bannerSecondaryURL !== data.bannerSecondaryURL) {
            try {
                await vercelIntegration.blob.delete(config.bannerSecondaryURL);
            } catch {
                console.error("Failed to delete old banner secondary from Vercel Blob");
            }
        }
        if (config?.bannerTertiaryURL && config.bannerTertiaryURL !== data.bannerTertiaryURL) {
            try {
                await vercelIntegration.blob.delete(config.bannerTertiaryURL);
            } catch {
                console.error("Failed to delete old banner tertiary from Vercel Blob");
            }
        }

        return await StoreRepository.updateConfigStore(store.id, data);
    },

    async getStoreBySlug(slug: string) {
        return await StoreRepository.getStoreBySlug(slug);
    },
}
