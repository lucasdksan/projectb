import { CreateProductDTO } from "../schemas/products.schema";
import { ProductsService } from "../services/products.service";

export const ProductsController = {
    async createProduct(dto: CreateProductDTO, storeId: number){
        return await ProductsService.createProduct(dto, storeId);
    },

    async quantityProducts(storeId: number) {
        return await ProductsService.quantityProducts(storeId);
    },
}