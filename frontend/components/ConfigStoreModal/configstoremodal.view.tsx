"use client";

import { createPortal } from "react-dom";
import type { ConfigStoreModel } from "./configstoremodal.model";
import { useConfigStoreViewModel } from "./configstoremodal.viewmodel";
import { useImperativeHandle, forwardRef } from "react";

interface ConfigStoreModalProps {
    config: ConfigStoreModel | null;
}

export const ConfigStoreModal = forwardRef<{ openModal: () => void }, ConfigStoreModalProps>(
    ({ config }, ref) => {
        const {
            isOpen,
            openModal,
            closeModal,
            form,
            updateField,
            logoPreview,
            handleLogoChange,
            removeLogo,
            fileInputRef,
            isLoading,
            handleSubmit,
            inputClassName,
            labelClassName,
            ACCEPTED_IMAGE_EXT,
        } = useConfigStoreViewModel(config);

        useImperativeHandle(ref, () => ({
            openModal,
        }));

        if (!isOpen) return null;

        return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl mx-4 bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">Configurar Loja</h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Logo Upload */}
                    <div className="space-y-3">
                        <label className={labelClassName}>Logo da Loja</label>
                        <div className="relative">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={ACCEPTED_IMAGE_EXT}
                                onChange={(e) => handleLogoChange(e.target.files?.[0] ?? null)}
                                className="hidden"
                            />

                            {logoPreview ? (
                                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10 bg-black/20 group">
                                    <img
                                        src={logoPreview}
                                        alt="Logo preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-4 py-2 bg-[#00ff41] text-black rounded-lg font-semibold hover:bg-[#00cc33] transition-colors"
                                        >
                                            Alterar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={removeLogo}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-48 rounded-xl border-2 border-dashed border-white/20 bg-black/20 hover:border-[#00ff41]/50 transition-colors flex flex-col items-center justify-center cursor-pointer group"
                                >
                                    <svg
                                        className="w-12 h-12 text-gray-400 group-hover:text-[#00ff41] transition-colors mb-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    <p className="text-gray-400 text-sm font-medium group-hover:text-[#00ff41] transition-colors">
                                        Arraste ou clique para upload
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        JPEG, PNG ou WebP (máx. 5MB)
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Primary Color */}
                    <div className="space-y-3">
                        <label className={labelClassName}>Cor Primária</label>
                        <div className="flex gap-3 items-end">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={form.primaryColor}
                                    onChange={(e) => updateField("primaryColor", e.target.value)}
                                    placeholder="#000000"
                                    className={inputClassName}
                                    maxLength={7}
                                />
                            </div>
                            <input
                                type="color"
                                value={form.primaryColor}
                                onChange={(e) => updateField("primaryColor", e.target.value)}
                                className="w-16 h-12 rounded-lg cursor-pointer border border-white/10"
                            />
                        </div>
                    </div>

                    {/* Secondary Color */}
                    <div className="space-y-3">
                        <label className={labelClassName}>Cor Secundária</label>
                        <div className="flex gap-3 items-end">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={form.secondaryColor}
                                    onChange={(e) => updateField("secondaryColor", e.target.value)}
                                    placeholder="#ffffff"
                                    className={inputClassName}
                                    maxLength={7}
                                />
                            </div>
                            <input
                                type="color"
                                value={form.secondaryColor}
                                onChange={(e) => updateField("secondaryColor", e.target.value)}
                                className="w-16 h-12 rounded-lg cursor-pointer border border-white/10"
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="p-4 bg-black/20 rounded-xl border border-white/10 space-y-3">
                        <p className="text-sm font-semibold text-gray-400">Pré-visualização</p>
                        <div className="flex gap-4 items-center">
                            <div
                                className="w-20 h-20 rounded-lg border border-white/10"
                                style={{ backgroundColor: form.primaryColor }}
                            />
                            <div
                                className="w-20 h-20 rounded-lg border border-white/10"
                                style={{ backgroundColor: form.secondaryColor }}
                            />
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex gap-3 border-t border-white/10 px-6 py-4 justify-end">
                    <button
                        type="button"
                        onClick={closeModal}
                        disabled={isLoading}
                        className="px-6 py-2 text-white border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-[#00ff41] text-black rounded-lg font-semibold hover:bg-[#00cc33] disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                        {isLoading && (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        )}
                        {isLoading ? "Salvando..." : "Salvar Configurações"}
                    </button>
                </div>
            </div>
        </div>,
            document.body
        );
    }
);

ConfigStoreModal.displayName = "ConfigStoreModal";

export { useConfigStoreViewModel };
