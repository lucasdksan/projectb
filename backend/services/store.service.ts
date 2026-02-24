import { StoreRepository } from "../repositories/store.repository";
import { UpdateStoreDTO } from "../schemas/store.schema";

export const StoreService = {
    async getStore(userId: number){
        return await StoreRepository.getStore(userId);
    },

    async createStore(userId: number, data: UpdateStoreDTO) {
        return await StoreRepository.createStore(userId, data);
    },

    async updateStore(userId: number, data: UpdateStoreDTO) {
        return await StoreRepository.updateStore(userId, data);
    },
}