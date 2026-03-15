"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getProductsByStoreSlugAction } from "@/app/(public)/store/[slug]/getproductsbystoreslug.action";
import type { ProductSearchModel } from "./productsearch.model";

const DEBOUNCE_MS = 300;
const POPUP_RESULTS_LIMIT = 6;

export interface SearchResultProduct {
    id: number;
    name: string;
    price: number;
    slug: string;
    images: { url: string }[];
}

export function useProductSearchViewModel(model: ProductSearchModel) {
    const router = useRouter();
    const [localValue, setLocalValue] = useState("");
    const [results, setResults] = useState<SearchResultProduct[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const fetchResults = useCallback(
        async (query: string) => {
            if (!query.trim() || !model.storeSlug) {
                setResults([]);
                return;
            }
            setIsLoading(true);
            try {
                const result = await getProductsByStoreSlugAction(
                    model.storeSlug,
                    1,
                    POPUP_RESULTS_LIMIT,
                    query.trim()
                );
                if (result.success && result.data) {
                    setResults(result.data.products);
                } else {
                    setResults([]);
                }
            } catch {
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        },
        [model.storeSlug]
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setLocalValue(value);

            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
            debounceRef.current = setTimeout(() => {
                fetchResults(value);
                debounceRef.current = null;
            }, DEBOUNCE_MS);
        },
        [fetchResults]
    );

    const handleFocus = useCallback(() => {
        if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
            blurTimeoutRef.current = null;
        }
        setIsPopupOpen(true);
        if (localValue.trim()) {
            fetchResults(localValue);
        } else {
            setResults([]);
        }
    }, [localValue, fetchResults]);

    const handleBlur = useCallback(() => {
        blurTimeoutRef.current = setTimeout(() => {
            setIsPopupOpen(false);
            blurTimeoutRef.current = null;
        }, 150);
    }, []);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsPopupOpen(false);
                (e.target as HTMLInputElement).blur();
                return;
            }
            if (e.key === "Enter" && results.length > 0 && isPopupOpen) {
                e.preventDefault();
                const product = results[0];
                router.push(
                    `/store/${model.storeSlug}/product/${product.slug}`
                );
                setIsPopupOpen(false);
            }
        },
        [results, isPopupOpen, model.storeSlug, router]
    );

    const selectProduct = useCallback(
        (product: SearchResultProduct) => {
            router.push(`/store/${model.storeSlug}/product/${product.slug}`);
            setIsPopupOpen(false);
            setLocalValue("");
            setResults([]);
        },
        [model.storeSlug, router]
    );

    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
            if (blurTimeoutRef.current) {
                clearTimeout(blurTimeoutRef.current);
            }
        };
    }, []);

    return {
        value: localValue,
        onChange: handleChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onKeyDown: handleKeyDown,
        placeholder: model.placeholder ?? "Buscar produtos...",
        results,
        isLoading,
        isPopupOpen,
        selectProduct,
        containerRef,
    };
}
