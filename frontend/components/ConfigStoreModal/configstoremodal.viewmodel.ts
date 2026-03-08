"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { updateConfigStoreAction } from "@/app/(private)/dashboard/settings/updateconfigstore.action";
import { useToast } from "@/frontend/hooks/useToast";
import type { ConfigStoreModel, ConfigStoreFormState } from "./configstoremodal.model";
import { defaultConfigStoreForm, ACCEPTED_IMAGE_TYPES, ACCEPTED_IMAGE_EXT } from "./configstoremodal.model";

const inputClassName =
    "w-full bg-[#0d0d0d] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#00ff41]/50 transition-all";
const labelClassName = "text-sm font-semibold text-gray-400";

function isObjectUrl(url: string): boolean {
    return url.startsWith("blob:");
}

function formStateFromModel(model: ConfigStoreModel | null): ConfigStoreFormState {
    if (!model) return defaultConfigStoreForm;
    return {
        primaryColor: model.primaryColor ?? "#000000",
        secondaryColor: model.secondaryColor ?? "#ffffff",
        logo: null,
    };
}

export function useConfigStoreViewModel(model: ConfigStoreModel | null) {
    const router = useRouter();
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState<ConfigStoreFormState>(() =>
        formStateFromModel(model)
    );
    const [logoPreview, setLogoPreview] = useState<string | null>(model?.logoUrl ?? null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setForm(formStateFromModel(model));
            setLogoPreview(model?.logoUrl ?? null);
        }
    }, [isOpen, model]);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setForm(formStateFromModel(model));
        setLogoPreview((prev) => {
            if (prev && isObjectUrl(prev)) {
                URL.revokeObjectURL(prev);
            }
            return model?.logoUrl ?? null;
        });
    }, [model]);

    const openModal = useCallback(() => {
        setIsOpen(true);
        setForm(formStateFromModel(model));
        setLogoPreview(model?.logoUrl ?? null);
    }, [model]);

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen, closeModal]);

    useEffect(() => {
        return () => {
            setLogoPreview((prev) => {
                if (prev && isObjectUrl(prev)) {
                    URL.revokeObjectURL(prev);
                }
                return null;
            });
        };
    }, []);

    const updateField = <K extends keyof ConfigStoreFormState>(
        field: K,
        value: ConfigStoreFormState[K]
    ) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleLogoChange = (file: File | null) => {
        setLogoPreview((prev) => {
            if (prev && isObjectUrl(prev)) {
                URL.revokeObjectURL(prev);
            }
            return prev;
        });
        updateField("logo", file);

        if (file) {
            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                toast?.showToast({
                    type: "error",
                    message: "Formato inválido. Use JPEG, PNG ou WebP.",
                });
                updateField("logo", null);
                setLogoPreview(model?.logoUrl ?? null);
                return;
            }
            const preview = URL.createObjectURL(file);
            setLogoPreview(preview);
        } else {
            setLogoPreview(model?.logoUrl ?? null);
        }
    };

    const removeLogo = () => {
        handleLogoChange(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form.primaryColor.trim()) {
            toast?.showToast({
                type: "error",
                message: "A cor primária é obrigatória",
            });
            return;
        }

        if (!form.secondaryColor.trim()) {
            toast?.showToast({
                type: "error",
                message: "A cor secundária é obrigatória",
            });
            return;
        }

        if (!form.logo && !model?.logoUrl) {
            toast?.showToast({
                type: "error",
                message: "A logo é obrigatória",
            });
            return;
        }

        setIsLoading(true);

        try {
            const fd = new FormData();
            fd.set("primaryColor", form.primaryColor.trim());
            fd.set("secondaryColor", form.secondaryColor.trim());
            if (form.logo) {
                fd.set("logo", form.logo);
            }

            const result = await updateConfigStoreAction(fd);

            if (result.success) {
                toast?.showToast({
                    type: "success",
                    message: "Configurações da loja atualizadas com sucesso!",
                });
                closeModal();
                router.refresh();
            } else {
                const errorMessage =
                    result.errors.global?.[0] ??
                    result.errors.primaryColor?.[0] ??
                    result.errors.secondaryColor?.[0] ??
                    result.errors.logo?.[0] ??
                    "Erro ao atualizar configurações";
                toast?.showToast({
                    type: "error",
                    message: errorMessage,
                });
            }
        } catch {
            toast?.showToast({
                type: "error",
                message: "Erro inesperado ao atualizar configurações",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return {
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
    };
}
