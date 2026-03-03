"use client";

import { createPortal } from "react-dom";
import { X, Sparkles, ImagePlus, Loader2, Copy, Check } from "lucide-react";
import { useGenerateAddsViewModel } from "./generateadds.viewmodel";
import type { GenerateAddsModel } from "./generateadds.model";

export default function GenerateAddsView(model: GenerateAddsModel) {
    const {
        isOpen,
        openModal,
        closeModal,
        selectedImageUrl,
        selectProductImage,
        handleFileSelect,
        clearImage,
        result,
        error,
        isLoading,
        handleSubmit,
        displayImage,
        handleCopyResult,
        fileInputRef,
        copied,
        isStructuredResult,
    } = useGenerateAddsViewModel(model);

    return (
        <>
            <button
                type="button"
                onClick={openModal}
                className="px-6 py-3 bg-[#00ff41] text-black rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#00ff41]/20"
            >
                Gerar Anúncio
            </button>

            {isOpen &&
                createPortal(
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-200"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="generate-adds-modal-title"
                    >
                        <div
                            className="absolute inset-0"
                            onClick={closeModal}
                            aria-hidden="true"
                        />
                        <div className="relative bg-[#161616] border border-white/10 rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl animate-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between mb-6">
                                <h2
                                    id="generate-adds-modal-title"
                                    className="text-xl font-bold text-white flex items-center gap-2"
                                >
                                    <Sparkles className="w-5 h-5 text-[#00ff41]" />
                                    Gerar Anúncio para Instagram
                                </h2>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                    aria-label="Fechar"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-sm text-gray-500 mb-4">
                                Selecione uma imagem do produto para melhorar o resultado da IA (opcional).
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                        Imagem do produto
                                    </span>
                                    <div className="flex flex-wrap gap-3">
                                        {model.productImages?.map((img, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => selectProductImage(img.url)}
                                                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all hover:border-[#00ff41]/50 ${
                                                    selectedImageUrl === img.url
                                                        ? "border-[#00ff41] ring-2 ring-[#00ff41]/30"
                                                        : "border-white/10"
                                                }`}
                                            >
                                                <img
                                                    src={img.url}
                                                    alt={`Produto ${i + 1}`}
                                                    className="w-full h-full object-cover"
                                                    referrerPolicy="no-referrer"
                                                />
                                            </button>
                                        ))}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,image/gif"
                                            className="hidden"
                                            onChange={handleFileSelect}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-16 h-16 rounded-xl border-2 border-dashed border-white/20 hover:border-[#00ff41]/40 flex items-center justify-center text-gray-500 hover:text-[#00ff41] transition-all"
                                        >
                                            <ImagePlus className="w-6 h-6" />
                                        </button>
                                    </div>
                                    {displayImage && (
                                        <div className="relative inline-flex">
                                            <div className="w-20 h-20 rounded-xl border-2 border-[#00ff41]/40 overflow-hidden">
                                                <img
                                                    src={displayImage}
                                                    alt="Selecionada"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={clearImage}
                                                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {error && (
                                    <p className="text-sm text-red-400" role="alert">
                                        {error}
                                    </p>
                                )}

                                {result && (
                                    <div className="rounded-2xl bg-[#0d0d0d] border border-white/5 p-4 space-y-3">
                                        {isStructuredResult(result) ? (
                                            <>
                                                <p className="font-bold text-white">{result.headline}</p>
                                                <p className="text-gray-400 text-sm">{result.description}</p>
                                                <p className="text-[#00ff41] text-sm font-medium">{result.cta}</p>
                                                <p className="text-gray-500 text-xs">{result.hashtags}</p>
                                                <button
                                                    type="button"
                                                    onClick={handleCopyResult}
                                                    className="flex items-center gap-2 text-xs text-[#00ff41] hover:underline mt-2"
                                                >
                                                    {copied ? (
                                                        <Check className="w-3.5 h-3.5" />
                                                    ) : (
                                                        <Copy className="w-3.5 h-3.5" />
                                                    )}
                                                    {copied ? "Copiado!" : "Copiar anúncio"}
                                                </button>
                                            </>
                                        ) : (
                                            <p className="text-gray-400 text-sm whitespace-pre-wrap">
                                                {"raw" in result ? result.raw : String(result)}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 bg-[#00ff41] text-black rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Gerando...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            {result ? "Gerar novamente" : "Gerar Anúncio"}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}
