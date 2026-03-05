"use client";

import { useState, useTransition } from "react";
import { productForSuggestionsAction } from "@/app/(private)/dashboard/products/[slug]/productforsuggestions.action";
import type { ProductForSuggestionsModel } from "./productforsuggestions.model";

export function useProductForSuggestionsViewModel(model: ProductForSuggestionsModel) {
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleGenerate = () => {
        setError(null);
        setSuggestion(null);

        startTransition(async () => {
            const res = await productForSuggestionsAction({
                name: model.name,
                description: model.description,
                price: model.price,
                stock: model.stock,
            });

            if (res.success) {
                setSuggestion(res.data.suggestion);
            } else {
                setError(
                    res.errors?.global?.[0] ?? "Não foi possível gerar a sugestão. Tente novamente."
                );
            }
        });
    };

    return { suggestion, error, isLoading: isPending, handleGenerate };
}
