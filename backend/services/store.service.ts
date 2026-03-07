import { StoreRepository } from "../repositories/store.repository";
import { UpdateStoreDTO } from "../schemas/store.schema";

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
}