"use client";

import { useProductForSuggestionsViewModel } from "./productforsuggestions.viewmodel";
import type { ProductForSuggestionsModel } from "./productforsuggestions.model";
import { FaWandMagicSparkles } from "react-icons/fa6";

export default function ProductForSuggestionsView(model: ProductForSuggestionsModel) {
    const { suggestion, error, isLoading, handleGenerate } = useProductForSuggestionsViewModel(model);

    return (
        <div className="bg-[#161616] border border-[#00ff41]/10 p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff41]/5 blur-3xl rounded-full"></div>
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <FaWandMagicSparkles className="w-4 h-4 text-[#00ff41]" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">
                        Sugestão da IA
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="px-4 py-2 bg-[#00ff41] text-black rounded-xl font-bold text-xs hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            Gerando...
                        </>
                    ) : (
                        <>
                            <FaWandMagicSparkles className="w-3.5 h-3.5" />
                            {suggestion ? "Gerar novamente" : "Gerar sugestão"}
                        </>
                    )}
                </button>
            </div>

            {error && (
                <p className="text-sm text-red-400 italic" role="alert">
                    {error}
                </p>
            )}

            {!isLoading && suggestion && (
                <p className="text-gray-400 text-sm leading-relaxed italic">
                    &quot;{suggestion}&quot;
                </p>
            )}

            {!suggestion && !isLoading && !error && (
                <p className="text-gray-500 text-sm italic">
                    Clique no botão acima para gerar uma sugestão de vendas ou marketing para este produto.
                </p>
            )}
        </div>
    );
}
