"use client";

import { createPortal } from "react-dom";
import { Trash2, X, AlertTriangle } from "lucide-react";
import { useDeleteProductViewModel } from "./deleteproduct.viewmodel";
import type { DeleteProductModel } from "./deleteproduct.model";

export default function DeleteProductView(model: DeleteProductModel) {
    const { isOpen, openModal, closeModal, confirmDelete, isLoading } =
        useDeleteProductViewModel(model);

    return (
        <>
            <button
                type="button"
                onClick={openModal}
                disabled={isLoading}
                className="px-6 py-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 font-bold text-sm hover:bg-red-500/30 hover:border-red-500/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
                <Trash2 className="w-4 h-4" />
                Deletar Produto
            </button>

            {isOpen &&
                createPortal(
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-200"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-product-modal-title"
                    >
                        <div
                            className="absolute inset-0"
                            onClick={closeModal}
                            aria-hidden="true"
                        />
                        <div className="relative bg-[#161616] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-xl animate-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between mb-6">
                                <h2
                                    id="delete-product-modal-title"
                                    className="text-xl font-bold text-white flex items-center gap-2"
                                >
                                    <AlertTriangle className="w-5 h-5 text-red-400" />
                                    Deletar Produto
                                </h2>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={isLoading}
                                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                                    aria-label="Fechar"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-gray-400 mb-8">
                                Tem certeza que deseja deletar este produto? Esta
                                ação não pode ser desfeita.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={isLoading}
                                    className="flex-1 bg-white/5 text-white py-3 rounded-xl font-bold hover:bg-white/10 transition-all border border-white/5 disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    disabled={isLoading}
                                    className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    {isLoading ? "Deletando..." : "Deletar"}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}
