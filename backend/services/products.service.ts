import { ProductsRepository } from "../repositories/products.repository";
import { CreateProductDTO, ListProductsDTO, UpdateProductDTO } from "../schemas/products.schema";

export const ProductsService = {
    async createProduct(dto: CreateProductDTO, storeId: number){
        const slug = dto.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s]/g, '')
            .trim()
            .replace(/\s+/g, '-');

        return await ProductsRepository.createProduct({
            slug,
            ...dto
        }, storeId);
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

    async deleteProduct(productId: number, storeId: number) {
        return await ProductsRepository.deleteProduct(productId, storeId);
    },
}