"use client";

import { useProductForSuggestionsViewModel } from "./productforsuggestions.viewmodel";
import type { ProductForSuggestionsModel } from "./productforsuggestions.model";
import { FaWandMagicSparkles } from "react-icons/fa6";

export default function ProductForSuggestionsView(model: ProductForSuggestionsModel) {
    const { suggestion, isLoading } = useProductForSuggestionsViewModel(model);

    return (
        <div className="bg-[#161616] border border-[#00ff41]/10 p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff41]/5 blur-3xl rounded-full"></div>
            <div className="flex items-center gap-3">
                <FaWandMagicSparkles className="w-4 h-4 text-[#00ff41]" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">
                    Sugestão da IA
                </h3>
            </div>

            {isLoading && (
                <div className="flex items-center gap-3 text-gray-500">
                    <div className="w-4 h-4 border-2 border-[#00ff41]/30 border-t-[#00ff41] rounded-full animate-spin"></div>
                    <p className="text-sm italic">Gerando sugestão...</p>
                </div>
            )}

            {!isLoading && suggestion && (
                <p className="text-gray-400 text-sm leading-relaxed italic">
                    &quot;{suggestion}&quot;
                </p>
            )}
        </div>
    );
}
