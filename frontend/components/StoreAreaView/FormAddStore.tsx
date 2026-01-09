"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { addStoreAction } from "@/app/(private)/dashboard/configuration/action";
import { useToast } from "@/frontend/hooks/useToast";
import Input from "@/frontend/ui/input";
import Button from "@/frontend/ui/button";
import { storeAreaViewSchema, storeAreaViewSchemaType } from "./schema";

export default function FormAddStore({ userId }: { userId: string }){
    const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
    const { showToast } = useToast();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<storeAreaViewSchemaType>({
        resolver: zodResolver(storeAreaViewSchema),
    });

    useEffect(() => {
        if (userId) {
            reset({
                userId
            });
        }
    }, [userId, reset]);

    async function onSubmit(data: storeAreaViewSchemaType) {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const result = await addStoreAction(formData);

        if (!result.success) {
            setServerErrors(result.errors ?? {});
            showToast({
                title: "Erro",
                message: result?.errors?.email?.[0] ?? "Erro ao cadastrar usuário",
                type: "error",
            });
            return;
        }

        showToast({
            title: "Sucesso",
            type: "success",
            message: "Loja registrada"
        });

        router.refresh();
        return;
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-3">
            <div className="w-full">
                <Input inputKey="name" type="text" label="Nome" {...register("name")} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" placeholder="Nome da Loja" />
                {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>
            <div className="w-full">
                <Input inputKey="email" type="email" label="E-mail" {...register("email")} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" placeholder="exemplo@email.com" />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
            <div className="w-full">
                <Input inputKey="number" type="tel" label="Contato" {...register("number")} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none"/>
                {errors.number && <p className="text-red-500">{errors.number.message}</p>}
            </div>
            <div className="w-full hidden">
                <Input inputKey="userId" type="text" label="" {...register("userId")} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none"/>
                {errors.userId && <p className="text-red-500">{errors.userId.message}</p>}
            </div>
            <Button label={isSubmitting ? "Registrando..." : "Registrar"} type="submit" className="bg-[color:var(--color-primary)] hover:bg-[#0fdc0f] text-[#111811] mt-2" />
        </form>
    );
}