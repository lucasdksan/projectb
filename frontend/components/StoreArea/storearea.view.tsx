"use client";

import { Pencil, Plus, Store } from "lucide-react";
import { StoreAreaProps } from "./storearea.model";
import { useStoreAreaViewModel } from "./storearea.viewmodel";

export default function StoreAreaView({ store }: StoreAreaProps) {
    const {
        form,
        isLoading,
        isModalOpen,
        hasStore,
        inputClassName,
        labelClassName,
        inputTextareaClassName,
        openModal,
        closeModal,
        handleSubmitStore,
        updateField,
    } = useStoreAreaViewModel(store);

    return (
        <>
            <section className="bg-[#161616] border border-white/5 p-8 rounded-3xl space-y-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
                        <Store className="text-xl" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Dados da Loja</h3>
                </div>

                {store ? (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className={labelClassName}>Nome da Loja</label>
                            <input
                                type="text"
                                className={inputClassName}
                                value={store?.name ?? ""}
                                readOnly
                                disabled
                            />
                        </div>
                        <div className="space-y-2">
                            <label className={labelClassName}>E-mail</label>
                            <input
                                type="email"
                                className={inputClassName}
                                value={store?.email ?? ""}
                                readOnly
                                disabled
                            />
                        </div>
                        <button
                            type="button"
                            className="w-full bg-white/5 text-white py-4 rounded-xl font-bold hover:bg-white/10 transition-all border border-white/5 flex items-center justify-center gap-2"
                            onClick={openModal}
                        >
                            {hasStore ? (
                                <>
                                    <Pencil className="text-lg" />
                                    Atualizar Loja
                                </>
                            ) : (
                                <>
                                    <Plus className="text-lg" />
                                    Cadastrar Loja
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <p className="text-white/50 text-sm">
                            Nenhuma loja cadastrada
                        </p>
                        <button
                            type="button"
                            className="w-full bg-white/5 text-white py-4 rounded-xl font-bold hover:bg-white/10 transition-all border border-white/5 flex items-center justify-center gap-2"
                            onClick={openModal}
                        >
                            <Plus className="text-lg" />
                            Cadastrar Loja
                        </button>
                    </div>
                )}
            </section>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-200"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="store-modal-title"
                >
                    <div
                        className="absolute inset-0"
                        onClick={closeModal}
                        aria-hidden="true"
                    />
                    <div className="relative bg-[#161616] border border-white/10 rounded-3xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl animate-in zoom-in-95 duration-200">
                        <h2 id="store-modal-title" className="text-xl font-bold text-white mb-6">
                            {hasStore ? "Atualizar dados da loja" : "Cadastrar loja"}
                        </h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className={labelClassName}>Nome da Loja</label>
                                <input
                                    type="text"
                                    className={inputClassName}
                                    value={form.name}
                                    onChange={(e) => updateField("name", e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className={labelClassName}>E-mail</label>
                                <input
                                    type="email"
                                    className={inputClassName}
                                    value={form.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className={labelClassName}>Telefone</label>
                                <input
                                    type="text"
                                    className={inputClassName}
                                    value={form.number}
                                    onChange={(e) => updateField("number", e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className={labelClassName}>Descrição</label>
                                <textarea
                                    className={inputTextareaClassName}
                                    value={form.description}
                                    onChange={(e) => updateField("description", e.target.value)}
                                    disabled={isLoading}
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className={labelClassName}>Tipo de Mercado</label>
                                <input
                                    type="text"
                                    className={inputClassName}
                                    value={form.typeMarket}
                                    onChange={(e) => updateField("typeMarket", e.target.value)}
                                    disabled={isLoading}
                                    placeholder="Ex: Varejo, Atacado, Serviços..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                className="flex-1 bg-white/5 text-white py-3 rounded-xl font-bold hover:bg-white/10 transition-all border border-white/5"
                                onClick={closeModal}
                                disabled={isLoading}
                            >
                                Fechar
                            </button>
                            <button
                                type="button"
                                className="flex-1 bg-white/10 text-white py-3 rounded-xl font-bold hover:bg-white/15 transition-all border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSubmitStore}
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? hasStore
                                        ? "Atualizando..."
                                        : "Cadastrando..."
                                    : hasStore
                                        ? "Salvar"
                                        : "Cadastrar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
