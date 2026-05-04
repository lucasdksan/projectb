import { useActionState } from "react";
import {
    listProductsAction,
    ListProductsActionResult,
    type ListProductsData,
} from "@/app/(private)/dashboard/products/listproducts.action";
import {
    ProductsState,
    mapProductToViewData,
    ProductModel,
    PaginationInfo,
} from "./productsview.model";

const DEFAULT_PAGINATION: PaginationInfo = {
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
};

function buildInitialState(
    initialProducts?: ProductModel[],
    initialPagination?: PaginationInfo
): ListProductsActionResult {
    return {
        success: true,
        data: {
            products: (initialProducts ??
                []) as unknown as ListProductsData,
            pagination: initialPagination ?? DEFAULT_PAGINATION,
        },
    };
}

export function useProductsViewModel(
    storeId: number,
    initialProducts?: ProductModel[],
    initialPagination?: PaginationInfo
) {
    const [state, formAction] = useActionState(
        listProductsAction,
        buildInitialState(initialProducts, initialPagination)
    );

    const products =
        state.success && state.data.products
            ? state.data.products.map(mapProductToViewData)
            : [];

    const pagination =
        state.success && state.data.pagination
            ? state.data.pagination
            : DEFAULT_PAGINATION;

    const viewState: ProductsState = {
        products,
        pagination,
        isLoading: false,
    };

    return {
        state: viewState,
        formAction,
        storeId,
    };
}