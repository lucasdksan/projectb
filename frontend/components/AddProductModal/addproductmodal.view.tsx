"use client";

import { Plus, ImagePlus, X } from "lucide-react";
import { useAddProductModalViewModel } from "./addproductmodal.viewmodel";
import { createPortal } from "react-dom";
import { ACCEPTED_IMAGE_EXT } from "./addproductmodal.model";

export default function AddProductModalView() {
    const {
        isOpen,
        toggleModal,
        closeModal,
        form,
        updateField,
        imagePreview,
        handleImageChange,
        removeImage,
        fileInputRef,
        isLoading,
        handleSubmit,
        labelClassName,
        inputClassName,
        inputTextareaClassName,
    } = useAddProductModalViewModel();

    return (
        <>
            <button
                className="bg-[#00ff41] text-black px-6 py-3 cursor-pointer rounded-xl font-bold hover:bg-[#00e03a] transition-all flex items-center gap-2 shadow-lg shadow-[#00ff41]/10"
                onClick={toggleModal}
                type="button"
            >
                <Plus className="text-lg" />
                Novo Produto
            </button>
            {isOpen &&
                createPortal(
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-200"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="add-product-modal-title"
                    >
                        <div
                            className="absolute inset-0"
                            onClick={closeModal}
                            aria-hidden="true"
                        />
                        <div className="relative bg-[#161616] border border-white/10 rounded-3xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl animate-in zoom-in-95 duration-200">
                            <h2
                                id="add-product-modal-title"
                                className="text-xl font-bold text-white mb-6"
                            >
                                Cadastrar produto
                            </h2>
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4"
                                noValidate
                            >
                                <div className="space-y-2">
                                    <label className={labelClassName}>
                                        Nome do produto
                                    </label>
                                    <input
                                        type="text"
                                        className={inputClassName}
                                        value={form.name}
                                        onChange={(e) =>
                                            updateField("name", e.target.value)
                                        }
                                        disabled={isLoading}
                                        placeholder="Ex: Camiseta Básica"
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelClassName}>
                                        Descrição (opcional)
                                    </label>
                                    <textarea
                                        className={inputTextareaClassName}
                                        value={form.description}
                                        onChange={(e) =>
                                            updateField(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        disabled={isLoading}
                                        rows={3}
                                        placeholder="Descreva o produto..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelClassName}>
                                        Imagem do produto (opcional)
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept={ACCEPTED_IMAGE_EXT}
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] ?? null;
                                                handleImageChange(file);
                                            }}
                                            disabled={isLoading}
                                        />
                                        {imagePreview ? (
                                            <div className="relative rounded-xl overflow-hidden bg-[#0d0d0d] border border-white/10">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview do produto"
                                                    className="w-full h-40 object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    disabled={isLoading}
                                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-red-500/90 transition-colors"
                                                    aria-label="Remover imagem"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isLoading}
                                                className="w-full h-24 border border-dashed border-white/20 rounded-xl flex items-center justify-center gap-2 text-gray-400 hover:border-[#00ff41]/50 hover:text-[#00ff41] transition-all"
                                            >
                                                <ImagePlus className="w-6 h-6" />
                                                <span className="text-sm font-medium">
                                                    Clique para enviar imagem (JPEG, PNG ou WebP)
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className={labelClassName}>
                                        Preço (R$)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className={inputClassName}
                                        value={form.price}
                                        onChange={(e) =>
                                            updateField("price", e.target.value)
                                        }
                                        disabled={isLoading}
                                        placeholder="0,00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelClassName}>
                                        Estoque
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        className={inputClassName}
                                        value={form.stock}
                                        onChange={(e) =>
                                            updateField("stock", e.target.value)
                                        }
                                        disabled={isLoading}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        className="flex-1 bg-white/5 text-white py-3 rounded-xl font-bold hover:bg-white/10 transition-all border border-white/5"
                                        onClick={closeModal}
                                        disabled={isLoading}
                                    >
                                        Fechar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-[#00ff41] text-black py-3 rounded-xl font-bold hover:bg-[#00e03a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isLoading}
                                    >
                                        {isLoading
                                            ? "Cadastrando..."
                                            : "Cadastrar"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}
