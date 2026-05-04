"use client";

import { useState, useTransition, useEffect } from "react";
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

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- reset client list when SSR model changes
        setProducts(model.initialProducts);
        setPagination(model.initialPagination);
    }, [
        model.initialProducts,
        model.initialPagination,
        model.initialSearch,
        model.storeSlug,
    ]);

    const hasPrevious = pagination.page > 1;
    const hasNext = pagination.page < pagination.totalPages;

    const handleGoToPage = (page: number) => {
        if (page < 1 || page > pagination.totalPages || isPending) return;

        startTransition(async () => {
            const result = await getProductsByStoreSlugAction(
                model.storeSlug,
                page,
                pagination.limit,
                model.initialSearch || undefined
            );

            if (result.success && result.data) {
                setProducts(result.data!.products);
                setPagination(result.data!.pagination);
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
