import { StoreService } from "../services/store.service";
import { UpdateStoreDTO } from "../schemas/store.schema";

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
}