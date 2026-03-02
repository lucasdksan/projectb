"use client";

import { EyeIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductsViewProps } from "./productsview.model";
import { useProductsViewModel } from "./productsview.viewmodel";
import Link from "next/link";

export default function ProductsView({
    storeId,
    initialProducts,
    initialPagination,
}: ProductsViewProps) {
    const { state, formAction } = useProductsViewModel(
        storeId,
        initialProducts,
        initialPagination
    );
    const { pagination } = state;
    const hasPrevious = pagination.page > 1;
    const hasNext = pagination.page < pagination.totalPages;

    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="storeId" value={storeId} />
            <input type="hidden" name="limit" value={pagination.limit} />

            <div className="flex gap-4">
                <input
                    name="search"
                    placeholder="Pesquisar produto..."
                    className="w-full rounded-lg bg-zinc-900 px-4 py-2"
                />

                <button
                    type="submit"
                    name="page"
                    value="1"
                    className="px-6 py-2 rounded-lg bg-green-600"
                >
                    Buscar
                </button>
            </div>

            <div className="bg-zinc-950 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-zinc-900 text-left text-sm">
                        <tr>
                            <th className="p-4">Produto</th>
                            <th className="p-4">Preço</th>
                            <th className="p-4">Estoque</th>
                            <th className="p-4">Data</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {state.products.map((product) => (
                            <tr
                                key={product.id}
                                className="border-t border-zinc-800"
                            >
                                <td className="p-4 flex items-center gap-4">
                                    {product.imageUrl && (
                                        <img
                                            src={product.imageUrl}
                                            className="w-12 h-12 rounded-md object-cover"
                                        />
                                    )}
                                    <span>{product.name}</span>
                                </td>

                                <td className="p-4 text-green-500">
                                    {product.priceFormatted}
                                </td>

                                <td className="p-4">
                                    <div className="space-y-1">
                                        <div className="w-32 h-2 bg-zinc-800 rounded">
                                            <div
                                                className="h-2 bg-green-500 rounded"
                                                style={{
                                                    width: `${product.stockPercentage}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm text-zinc-400">
                                            {product.stockLabel}
                                        </span>
                                    </div>
                                </td>

                                <td className="p-4">
                                    {product.createdAtFormatted}
                                </td>
                                <td className="p-4">
                                    <Link href={`/dashboard/products/${product.id}`}>
                                        <EyeIcon className="w-4 h-4 text-zinc-400" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {state.products.length === 0 && (
                    <div className="p-6 text-center text-zinc-500">
                        Nenhum produto encontrado.
                    </div>
                )}

                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between gap-4 p-4 border-t border-zinc-800 bg-zinc-900/50">
                        <span className="text-sm text-zinc-400">
                            Mostrando{" "}
                            {(pagination.page - 1) * pagination.limit + 1} a{" "}
                            {Math.min(
                                pagination.page * pagination.limit,
                                pagination.total
                            )}{" "}
                            de {pagination.total} produtos
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                type="submit"
                                name="page"
                                value={pagination.page - 1}
                                disabled={!hasPrevious}
                                className="p-2 rounded-lg bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                                aria-label="Página anterior"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <span className="text-sm text-zinc-300 px-2">
                                Página {pagination.page} de {pagination.totalPages}
                            </span>

                            <button
                                type="submit"
                                name="page"
                                value={pagination.page + 1}
                                disabled={!hasNext}
                                className="p-2 rounded-lg bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                                aria-label="Próxima página"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </form>
    );
}