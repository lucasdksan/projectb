"use client";

import { useState, useEffect } from "react";
import { productForSuggestionsAction } from "@/app/(private)/dashboard/products/[slug]/productforsuggestions.action";
import type { ProductForSuggestionsModel } from "./productforsuggestions.model";

export function useProductForSuggestionsViewModel(model: ProductForSuggestionsModel) {
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function fetchSuggestion() {
            setError(null);
            const res = await productForSuggestionsAction({
                name: model.name,
                description: model.description,
                price: model.price,
                stock: model.stock,
            });

            if (cancelled) return;

            if (res.success) {
                setSuggestion(res.data.suggestion);
            } else {
                setError(
                    res.errors?.global?.[0] ?? "Não foi possível gerar a sugestão. Tente recarregar."
                );
            }
            setIsLoading(false);
        }

        void fetchSuggestion();

        return () => {
            cancelled = true;
        };
    }, [model.name, model.description, model.price, model.stock]);

    return { suggestion, error, isLoading };
}
