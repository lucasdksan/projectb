"use client"

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"
import { product } from "@/backend/modules/product/product.types"
import ProductItem from "./ProductItem";
import FormSearch from "./FormSearch";

interface ProductListProps {
    products: product[];
    total: number;
    page: number;
    limit: number;
}

export default function ProductList({ products, total, page, limit }: ProductListProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState<string>(searchParams.get("search") ?? "");

    const totalPages = Math.ceil(total / limit);

    function goToPage(p: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(p));
        params.set("limit", String(limit));
        router.push(`/dashboard/product/list?${params.toString()}`);
    }

    function onSearchSubmit(e: FormEvent) {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        params.set("search", search);
        params.set("page", "1");
        router.push(`/dashboard/product/list?${params.toString()}`);
    }

    return (
        <>
            <FormSearch className="relative w-full md:max-w-md group flex gap-3.5" search={search} setSearch={setSearch} onSubmit={onSearchSubmit} />
            <div className="flex flex-col gap-3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-background border-b border-gray-100 text-xs uppercase tracking-wider text-text-sub font-semibold">
                                    <th className="px-6 py-4">Produto</th>
                                    <th className="px-6 py-4">Preço</th>
                                    <th className="px-6 py-4">Data de Geração</th>
                                    <th className="px-6 py-4 text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((p: product) => (
                                    <ProductItem key={p.id} product={p} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                    <span>
                        Mostrando {(page - 1) * limit + 1} - {Math.min(page * limit, total)} de {total} resultados
                    </span>

                    <div className="flex gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => goToPage(page - 1)}
                            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
                        >
                            ←
                        </button>

                        <button
                            disabled={page >= totalPages}
                            onClick={() => goToPage(page + 1)}
                            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
                        >
                            →
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
