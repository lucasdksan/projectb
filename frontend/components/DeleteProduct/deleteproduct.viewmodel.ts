"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteProductAction } from "@/app/(private)/dashboard/products/[slug]/deleteproduct.action";
import { useToast } from "@/frontend/hooks/useToast";
import type { DeleteProductModel } from "./deleteproduct.model";

export function useDeleteProductViewModel(model: DeleteProductModel) {
    const router = useRouter();
    const toast = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const openModal = () => {
        setIsOpen(true);
        router.prefetch("/dashboard/products");
    };
    const closeModal = () => !isLoading && setIsOpen(false);

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen, isLoading]);

    const confirmDelete = async () => {
        setIsLoading(true);

        try {
            const result = await deleteProductAction(model.id);

            if (result.success) {
                window.location.replace("/dashboard/products?deleted=1");
            } else {
                const errorMessage =
                    result.errors.global?.[0] ?? "Erro ao deletar produto";
                toast?.showToast({
                    type: "error",
                    message: errorMessage,
                });
                setIsLoading(false);
            }
        } catch {
            toast?.showToast({
                type: "error",
                message: "Erro inesperado ao deletar produto",
            });
            setIsLoading(false);
        }
    };

    return {
        isOpen,
        openModal,
        closeModal,
        confirmDelete,
        isLoading,
    };
}
