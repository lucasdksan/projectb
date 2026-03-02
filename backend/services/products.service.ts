import { ProductsRepository } from "../repositories/products.repository";
import { CreateProductDTO, ListProductsDTO } from "../schemas/products.schema";

export const ProductsService = {
    async createProduct(dto: CreateProductDTO, storeId: number){
        return await ProductsRepository.createProduct(dto, storeId);
    },

    async quantityProducts(storeId: number) {
        return await ProductsRepository.quantityProducts(storeId);
    },

    async listProducts(dto: ListProductsDTO) {
        return await ProductsRepository.listProducts(dto);
    },
}