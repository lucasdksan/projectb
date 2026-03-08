import { StoreService } from "../services/store.service";
import { UpdateStoreDTO, UpdateConfigStoreDTO } from "../schemas/store.schema";

export const StoreController = {
    async getStore(userId: number){
        return await StoreService.getStore(userId);
    },

    async createStore(userId: number, data: UpdateStoreDTO) {
        return await StoreService.createStore(userId, data);
    },

    async updateStore(userId: number, data: UpdateStoreDTO) {
        return await StoreService.updateStore(userId, data);
    },

    async getStoreId(userId: number) {
        return await StoreService.getStoreId(userId);
    },

    async updateConfigStore(userId: number, data: UpdateConfigStoreDTO) {
        return await StoreService.updateConfigStore(userId, data);
    },
}