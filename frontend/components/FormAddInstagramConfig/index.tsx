"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { addInstagramConfigSchema, addInstagramConfigSchemaType } from "./schema";
import { useToast } from "@/frontend/hooks/useToast";
import { useEffect } from "react";
import { addInstagramConfigAction } from "@/app/(private)/dashboard/store/action";
import Input from "@/frontend/ui/input";
import Button from "@/frontend/ui/button";

interface FormAddInstagramConfigProps {
    storeId: number;
}

export default function FormAddInstagramConfig({ storeId }: FormAddInstagramConfigProps) {
    const { showToast } = useToast();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<addInstagramConfigSchemaType>({
        resolver: zodResolver(addInstagramConfigSchema),
    });

    useEffect(() => {
        if (storeId) {
            reset({
                storeId
            });
        }
    }, [storeId, reset]);

    async function onSubmit(data: addInstagramConfigSchemaType) {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, String(value));
        });

        const result = await addInstagramConfigAction(formData);

        if (!result.success) {
            if(result.errors && Object.keys(result.errors).length > 0) {
                Object.entries(result.errors).forEach(([key, value]) => {
                    showToast({
                        title: "Erro",
                        message: value[0] ?? "Erro ao cadastrar configuração do Instagram",
                        type: "error",
                    });
                });
            } else {
                showToast({
                    title: "Erro",
                    message: result.message ?? "Erro ao cadastrar configuração do Instagram",
                    type: "error",
                });
            }

            return;
        }

        showToast({
            title: "Sucesso",
            type: "success",
            message: result.message ?? "Configuração do Instagram cadastrada com sucesso"
        });

        router.refresh();
        return;
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-3">
            <div className="w-full">
                <Input inputKey="token" type="text" label="Token" {...register("token")} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" placeholder="Token do Instagram" />
                {errors.token && <p className="text-red-500">{errors.token.message}</p>}
            </div>
            <div className="w-full">
                <Input inputKey="userInstagramId" type="text" label="ID do Usuário do Instagram" {...register("userInstagramId")} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" placeholder="1234567890" />
                {errors.userInstagramId && <p className="text-red-500">{errors.userInstagramId.message}</p>}
            </div>
            <div className="w-full">
                <Input inputKey="storeId" type="number" label="ID da Loja" {...register("storeId", { valueAsNumber: true })} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" placeholder="1234567890" />
                {errors.storeId && <p className="text-red-500">{errors.storeId.message}</p>}
            </div>
            <Button label={isSubmitting ? "Registrando..." : "Registrar"} type="submit" className="bg-[color:var(--color-primary)] hover:bg-[#0fdc0f] text-[#111811] mt-2" />
        </form>
    );
}