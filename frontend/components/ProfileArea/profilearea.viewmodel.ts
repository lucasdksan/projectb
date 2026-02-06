"use client";

import { updateUserAction } from "@/app/(private)/dashboard/settings/update.action";
import { useToast } from "@/frontend/hooks/useToast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useProfileAreaViewModel(initialName: string) {
    const router = useRouter();
    const [name, setName] = useState(initialName);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleUpdateProfile = async () => {
        if (!name.trim()) {
            toast?.showToast({
                type: "error",
                message: "O nome não pode estar vazio",
            });
            return;
        }

        setIsLoading(true);

        try {
            const result = await updateUserAction({ name });

            if (result.success) {
                toast?.showToast({
                    type: "success",
                    message: "Perfil atualizado com sucesso!",
                });

                router.refresh();
            } else {
                const errorMessage = result.errors.global?.[0] || result.errors.name?.[0] || "Erro ao atualizar perfil";
                toast?.showToast({
                    type: "error",
                    message: errorMessage,
                });
            }
        } catch (error) {
            toast?.showToast({
                type: "error",
                message: "Erro inesperado ao atualizar perfil",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        name,
        setName,
        isLoading,
        handleUpdateProfile,
    };
}
