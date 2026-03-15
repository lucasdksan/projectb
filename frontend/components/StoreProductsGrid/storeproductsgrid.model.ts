import type { ProductListItem, PaginationInfo } from "@/app/(public)/store/[slug]/getproductsbystoreslug.action";

export interface StoreProductsGridModel {
    storeSlug: string;
    initialProducts: ProductListItem[];
    initialPagination: PaginationInfo;
    initialSearch?: string;
    primaryColor?: string;
}
