"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createProductAction } from "@/app/(private)/dashboard/(home)/createproduct.action";
import { useToast } from "@/frontend/hooks/useToast";
import {
    AddProductFormState,
    defaultAddProductForm,
    ACCEPTED_IMAGE_TYPES,
} from "./addproductmodal.model";

const inputClassName =
    "w-full bg-[#0d0d0d] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#00ff41]/50 transition-all";
const labelClassName = "text-sm font-semibold text-gray-400";
const inputTextareaClassName =
    inputClassName + " min-h-[80px] resize-y";

export function useAddProductModalViewModel() {
    const router = useRouter();
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState<AddProductFormState>(defaultAddProductForm);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const toggleModal = () => {
        setIsOpen((prev) => !prev);
        if (!isOpen) {
            setForm(defaultAddProductForm);
            clearImagePreview();
        }
    };

    const closeModal = () => {
        setIsOpen(false);
        setForm(defaultAddProductForm);
        clearImagePreview();
    };

    const clearImagePreview = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen]);

    useEffect(() => {
        return () => clearImagePreview();
    }, []);

    const updateField = <K extends keyof AddProductFormState>(
        field: K,
        value: AddProductFormState[K]
    ) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (file: File | null) => {
        clearImagePreview();
        updateField("image", file);
        if (file) {
            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                toast?.showToast({
                    type: "error",
                    message: "Formato inválido. Use JPEG, PNG ou WebP.",
                });
                updateField("image", null);
                return;
            }
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        handleImageChange(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form.name.trim()) {
            toast?.showToast({
                type: "error",
                message: "O nome do produto é obrigatório",
            });
            return;
        }

        setIsLoading(true);

        try {
            const fd = new FormData();
            fd.set("name", form.name.trim());
            fd.set("description", form.description.trim());
            fd.set("price", form.price);
            fd.set("stock", form.stock);
            if (form.image) {
                fd.set("image", form.image);
            }

            const result = await createProductAction(fd);

            if (result.success) {
                toast?.showToast({
                    type: "success",
                    message: "Produto cadastrado com sucesso!",
                });
                closeModal();
                router.refresh();
            } else {
                const errorMessage =
                    result.errors.global?.[0] ??
                    result.errors.name?.[0] ??
                    result.errors.price?.[0] ??
                    result.errors.stock?.[0] ??
                    result.errors.image?.[0] ??
                    "Erro ao cadastrar produto";
                toast?.showToast({
                    type: "error",
                    message: errorMessage,
                });
            }
        } catch {
            toast?.showToast({
                type: "error",
                message: "Erro inesperado ao cadastrar produto",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return {
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
        inputClassName,
        labelClassName,
        inputTextareaClassName,
    };
}
