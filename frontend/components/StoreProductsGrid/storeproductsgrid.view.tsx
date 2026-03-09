"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import CardProductView from "@/frontend/components/CardProduct/cardproduct.view";
import { useStoreProductsGridViewModel } from "./storeproductsgrid.viewmodel";
import type { StoreProductsGridModel } from "./storeproductsgrid.model";

interface StoreProductsGridViewProps extends StoreProductsGridModel {}

export default function StoreProductsGridView(props: StoreProductsGridViewProps) {
    const {
        products,
        pagination,
        hasPrevious,
        hasNext,
        isLoading,
        handleGoToPage,
    } = useStoreProductsGridViewModel(props);

    return (
        <div className="w-full flex flex-col items-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-6xl">
                {products.map((product) => (
                    <CardProductView
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        slug={product.slug}
                        images={product.images}
                        storeSlug={props.storeSlug}
                    />
                ))}
            </div>

            {products.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-12 w-full">
                    Nenhum produto disponível
                </p>
            )}

            {pagination.totalPages > 1 && (
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-t border-gray-200 mt-6">
                    <span className="text-sm text-gray-500 order-2 sm:order-1">
                        Mostrando{" "}
                        {(pagination.page - 1) * pagination.limit + 1} a{" "}
                        {Math.min(
                            pagination.page * pagination.limit,
                            pagination.total
                        )}{" "}
                        de {pagination.total} produtos
                    </span>
                    <div className="flex items-center gap-2 order-1 sm:order-2">
                        <button
                            type="button"
                            onClick={() => handleGoToPage(pagination.page - 1)}
                            disabled={!hasPrevious || isLoading}
                            className="p-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            aria-label="Página anterior"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-700" />
                        </button>
                        <span className="text-sm text-gray-700 px-2 min-w-[100px] text-center">
                            Página {pagination.page} de {pagination.totalPages}
                        </span>
                        <button
                            type="button"
                            onClick={() => handleGoToPage(pagination.page + 1)}
                            disabled={!hasNext || isLoading}
                            className="p-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            aria-label="Próxima página"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-700" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
