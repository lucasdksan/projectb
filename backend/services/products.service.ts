import { ProductsRepository } from "../repositories/products.repository";
import { CreateProductDTO, ListProductsDTO, UpdateProductDTO } from "../schemas/products.schema";

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

    async getProduct(slug: number) {
        return await ProductsRepository.getProduct(slug);
    },

    async updateProduct(productId: number, storeId: number, dto: UpdateProductDTO) {
        return await ProductsRepository.updateProduct(productId, storeId, dto);
    },
}