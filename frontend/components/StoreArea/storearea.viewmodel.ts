"use client";

import { createStoreAction } from "@/app/(private)/dashboard/settings/createstore.action";
import { updateStoreAction } from "@/app/(private)/dashboard/settings/updatestore.action";
import { useToast } from "@/frontend/hooks/useToast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StoreFormState, defaultStoreForm } from "./storearea.model";

const inputClassName =
    "w-full bg-[#0d0d0d] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#00ff41]/50 transition-all";
const labelClassName = "text-sm font-semibold text-gray-400";
const inputTextareaClassName = inputClassName + " min-h-[80px] resize-y";

export function useStoreAreaViewModel(initialStore: StoreFormState | undefined | null) {
    const router = useRouter();
    const hasStore = initialStore != null;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState<StoreFormState>({
        name: initialStore?.name ?? defaultStoreForm.name,
        email: initialStore?.email ?? defaultStoreForm.email,
        number: initialStore?.number ?? defaultStoreForm.number,
        description: initialStore?.description ?? defaultStoreForm.description,
        typeMarket: initialStore?.typeMarket ?? defaultStoreForm.typeMarket,
    });
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        if (!isModalOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isModalOpen, closeModal]);

    const updateField = <K extends keyof StoreFormState>(field: K, value: StoreFormState[K]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmitStore = async () => {
        if (!form.name.trim()) {
            toast?.showToast({
                type: "error",
                message: "O nome da loja não pode estar vazio",
            });
            return;
        }
        if (!form.email.trim()) {
            toast?.showToast({
                type: "error",
                message: "O e-mail não pode estar vazio",
            });
            return;
        }
        if (!form.number.trim()) {
            toast?.showToast({
                type: "error",
                message: "O telefone não pode estar vazio",
            });
            return;
        }
        if (!form.description.trim()) {
            toast?.showToast({
                type: "error",
                message: "A descrição não pode estar vazia",
            });
            return;
        }
        if (!form.typeMarket.trim()) {
            toast?.showToast({
                type: "error",
                message: "O tipo de mercado não pode estar vazio",
            });
            return;
        }

        setIsLoading(true);

        try {
            const result = hasStore
                ? await updateStoreAction(form)
                : await createStoreAction(form);

            if (result.success) {
                toast?.showToast({
                    type: "success",
                    message: hasStore
                        ? "Dados da loja atualizados com sucesso!"
                        : "Loja cadastrada com sucesso!",
                });
                closeModal();
                router.refresh();
            } else {
                const errorMessage =
                    result.errors.global?.[0] ??
                    result.errors.name?.[0] ??
                    result.errors.email?.[0] ??
                    result.errors.number?.[0] ??
                    result.errors.description?.[0] ??
                    result.errors.typeMarket?.[0] ??
                    (hasStore ? "Erro ao atualizar loja" : "Erro ao cadastrar loja");
                toast?.showToast({
                    type: "error",
                    message: errorMessage,
                });
            }
        } catch {
            toast?.showToast({
                type: "error",
                message: hasStore
                    ? "Erro inesperado ao atualizar loja"
                    : "Erro inesperado ao cadastrar loja",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        form,
        updateField,
        isLoading,
        handleSubmitStore,
        isModalOpen,
        openModal,
        closeModal,
        hasStore,
        inputClassName,
        labelClassName,
        inputTextareaClassName,
    };
}
