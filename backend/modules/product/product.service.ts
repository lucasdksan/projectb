import { Errors } from "@/backend/shared/errors/errors";
import { createProduct, createProductSchema, updateProduct, updateProductSchema } from "./product.types";
import { ProductRepository } from "./product.repository";

export const ProductService = {
    async create(data: createProduct){
        const validatedData = createProductSchema.safeParse(data);

        if(!validatedData.success) throw Errors.validation("Invalid data", validatedData.error.message);

        const { storeId } = validatedData.data;
        const store = await ProductRepository.findByStoreId(storeId);

        if(!store) throw Errors.unauthorized("Loja não identificada");

        const { updatedAt, createdAt, ...product } = await ProductRepository.create(validatedData.data);

        return product;
    },

    async listByStoreId(storeId: number){
        const products = await ProductRepository.listByStoreId(storeId);

        return products;
    },

    async paginationByStoreId(storeId: number, page: number, limit: number, search?: string){
        return await ProductRepository.paginationByStoreId(storeId, page, limit, search);
    },

    async findById(id: number){
        const product = await ProductRepository.findById(id);

        return product;
    },

    async update(id: number, data: updateProduct){
        const validatedData = updateProductSchema.safeParse(data);

        if(!validatedData.success) throw Errors.validation("Invalid data", validatedData.error.message);

        const { updatedAt, createdAt, ...product } = await ProductRepository.update(id, validatedData.data);

        return product;
    },

    async delete(id: number){
        return await ProductRepository.delete(id);
    }
};
