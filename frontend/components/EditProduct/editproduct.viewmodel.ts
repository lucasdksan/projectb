"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateProductAction } from "@/app/(private)/dashboard/products/[slug]/updateproduct.action";
import { useToast } from "@/frontend/hooks/useToast";
import type { EditProductModel, EditProductFormState } from "./editproduct.model";
import { centsToReaisInputString } from "@/libs/format-currency";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_IMAGE_EXT = ".jpg,.jpeg,.png,.webp";

const inputClassName =
    "w-full bg-[#0d0d0d] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#00ff41]/50 transition-all";
const labelClassName = "text-sm font-semibold text-gray-400";
const inputTextareaClassName = inputClassName + " min-h-[80px] resize-y";

function formStateFromModel(model: EditProductModel): EditProductFormState {
    return {
        name: model.name ?? "",
        description: model.description ?? "",
        price: model.price != null ? centsToReaisInputString(model.price) : "",
        stock: model.stock?.toString() ?? "0",
        image: null,
        isActive: model.isActive ?? true,
    };
}

export function useEditProductViewModel(model: EditProductModel) {
    const router = useRouter();
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState<EditProductFormState>(() =>
        formStateFromModel(model)
    );
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setForm(formStateFromModel(model));
            setImagePreview(null);
        }
    }, [isOpen, model.id]);

    const openModal = () => {
        setIsOpen(true);
        setForm(formStateFromModel(model));
        setImagePreview(null);
    };

    const closeModal = () => {
        setIsOpen(false);
        setForm(formStateFromModel(model));
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
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, []);

    const updateField = <K extends keyof EditProductFormState>(
        field: K,
        value: EditProductFormState[K]
    ) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (file: File | null) => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
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
            fd.set("productId", String(model.id));
            fd.set("name", form.name.trim());
            fd.set("description", form.description.trim());
            fd.set("price", form.price);
            fd.set("stock", form.stock);
            fd.set("isActive", String(form.isActive));
            if (form.image) {
                fd.set("image", form.image);
            }

            const result = await updateProductAction(fd);

            if (result.success) {
                toast?.showToast({
                    type: "success",
                    message: "Produto atualizado com sucesso!",
                });
                closeModal();
                router.refresh();
            } else {
                const errorMessage =
                    result.errors.global?.[0] ??
                    result.errors.name?.[0] ??
                    result.errors.price?.[0] ??
                    result.errors.stock?.[0] ??
                    result.errors.isActive?.[0] ??
                    result.errors.image?.[0] ??
                    "Erro ao atualizar produto";
                toast?.showToast({
                    type: "error",
                    message: errorMessage,
                });
            }
        } catch {
            toast?.showToast({
                type: "error",
                message: "Erro inesperado ao atualizar produto",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const displayImage = imagePreview ?? model.images?.[0]?.url ?? null;

    return {
        isOpen,
        openModal,
        closeModal,
        form,
        updateField,
        displayImage,
        handleImageChange,
        removeImage,
        fileInputRef,
        isLoading,
        handleSubmit,
        inputClassName,
        labelClassName,
        inputTextareaClassName,
        ACCEPTED_IMAGE_EXT,
    };
}
