import { CreateProductDTO, ListProductsDTO, ListProductsByStoreSlugDTO, UpdateProductDTO } from "../schemas/products.schema";
import { ProductsService } from "../services/products.service";

export const ProductsController = {
    async createProduct(dto: CreateProductDTO, storeId: number){
        return await ProductsService.createProduct(dto, storeId);
    },

    async quantityProducts(storeId: number) {
        return await ProductsService.quantityProducts(storeId);
    },

    async listProducts(dto: ListProductsDTO) {
        return await ProductsService.listProducts(dto);
    },

    async listProductsByStoreSlug(dto: ListProductsByStoreSlugDTO) {
        return await ProductsService.listProductsByStoreSlug(dto);
    },

    async getProduct(slug: number) {
        return await ProductsService.getProduct(slug);
    },

    async getProductByStoreSlugAndProductSlug(
        storeSlug: string,
        productSlug: string
    ) {
        return await ProductsService.getProductByStoreSlugAndProductSlug(
            storeSlug,
            productSlug
        );
    },

    async updateProduct(productId: number, storeId: number, dto: UpdateProductDTO) {
        return await ProductsService.updateProduct(productId, storeId, dto);
    },

    async deleteProduct(productId: number, storeId: number) {
        return await ProductsService.deleteProduct(productId, storeId);
    },
}