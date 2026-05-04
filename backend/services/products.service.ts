import { ProductsRepository } from "../repositories/products.repository";
import { StoreService } from "./store.service";
import { CreateProductDTO, ListProductsDTO, ListProductsByStoreSlugDTO, UpdateProductDTO } from "../schemas/products.schema";

export const ProductsService = {
    async createProduct(dto: CreateProductDTO, storeId: number) {
        const baseSlug = dto.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s]/g, "")
            .trim()
            .replace(/\s+/g, "-") || "produto";

        let candidate = baseSlug;
        let suffix = 2;
        while (await ProductsRepository.slugExistsInStore(storeId, candidate)) {
            candidate = `${baseSlug}-${suffix}`;
            suffix += 1;
        }

        return await ProductsRepository.createProduct(
            {
                slug: candidate,
                ...dto,
            },
            storeId,
        );
    },
    async quantityProducts(storeId: number) {
        return await ProductsRepository.quantityProducts(storeId);
    },

    async listProducts(dto: ListProductsDTO) {
        return await ProductsRepository.listProducts(dto);
    },

    async listProductsByStoreSlug(dto: ListProductsByStoreSlugDTO) {
        const store = await StoreService.getStoreBySlug(dto.storeSlug);
        if (!store) return null;

        return await ProductsRepository.listProducts({
            storeId: store.id,
            page: dto.page,
            limit: dto.limit,
            search: dto.search?.trim() || undefined,
            activeOnly: true,
        });
    },

    async getProductById(productId: number) {
        return await ProductsRepository.getProductById(productId);
    },

    async getProductByStoreSlugAndProductSlug(
        storeSlug: string,
        productSlug: string
    ) {
        return await ProductsRepository.getProductByStoreSlugAndProductSlug(
            storeSlug,
            productSlug
        );
    },

    async updateProduct(productId: number, storeId: number, dto: UpdateProductDTO) {
        return await ProductsRepository.updateProduct(productId, storeId, dto);
    },

    async deleteProduct(productId: number, storeId: number) {
        return await ProductsRepository.deleteProduct(productId, storeId);
    },
}