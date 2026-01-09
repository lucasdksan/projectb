import { Errors } from "@/backend/shared/errors/errors";
import { createStore, createStoreSchema } from "./store.types";
import { StoreRepository } from "./store.repository";

export const StoreService = {
    async create(data: createStore){
        const validatedData = createStoreSchema.safeParse(data);

        if(!validatedData.success) {
            throw Errors.validation("Invalid data", validatedData.error.message);
        }

        const { email, name, number, userId } = validatedData.data;
        const findStore = await StoreRepository.findByUserId(userId);    
    
        if(findStore) {
            throw Errors.validation("Invalid data", "Store exist");
        }

        await StoreRepository.create({
            email,
            name,
            number,
            userId
        });
        
        return {
            email,
            name,
            number,
        }
    },

    async findByUserId(userId: string) {
        const id = parseInt(userId);

        const store = await StoreRepository.findByUserId(id);
        
        if(!store) return null;

        const { email, name, number, id: storeId } = store;

        return { 
            email,
            name,
            number,
            id: storeId
         };
    }
};