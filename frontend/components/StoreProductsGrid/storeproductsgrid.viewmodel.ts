"use client";

import { useState, useTransition } from "react";
import { getProductsByStoreSlugAction } from "@/app/(public)/store/[slug]/getproductsbystoreslug.action";
import type {
    ProductListItem,
    PaginationInfo,
} from "@/app/(public)/store/[slug]/getproductsbystoreslug.action";
import type { StoreProductsGridModel } from "./storeproductsgrid.model";

export function useStoreProductsGridViewModel(model: StoreProductsGridModel) {
    const [products, setProducts] = useState<ProductListItem[]>(
        model.initialProducts
    );
    const [pagination, setPagination] = useState<PaginationInfo>(
        model.initialPagination
    );
    const [isPending, startTransition] = useTransition();

    const hasPrevious = pagination.page > 1;
    const hasNext = pagination.page < pagination.totalPages;

    const handleGoToPage = (page: number) => {
        if (page < 1 || page > pagination.totalPages || isPending) return;

        startTransition(async () => {
            const result = await getProductsByStoreSlugAction(
                model.storeSlug,
                page,
                pagination.limit
            );

            if (result.success && result.data) {
                setProducts(result.data!.products);
                setPagination(result.data!.pagination);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    };

    return {
        products,
        pagination,
        hasPrevious,
        hasNext,
        isLoading: isPending,
        handleGoToPage,
    };
}
