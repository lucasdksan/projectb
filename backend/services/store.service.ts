import { StoreRepository } from "../repositories/store.repository";
import { UpdateStoreDTO } from "../schemas/store.schema";

export const StoreService = {
    async getStore(userId: number){
        return await StoreRepository.getStore(userId);
    },

    async createStore(userId: number, data: UpdateStoreDTO) {
        return await StoreRepository.createStore(userId, {
            slug: data.name.toLowerCase().replace(/ /g, '-'),
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