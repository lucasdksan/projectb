"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storeUpdateAreaViewSchema, storeUpdateAreaViewSchemaType } from "./schema";
import { useToast } from "@/frontend/hooks/useToast";
import Button from "@/frontend/ui/button";
import Input from "@/frontend/ui/input";

export default function FormUpdateStore({ email, name, number, id }: storeUpdateAreaViewSchemaType){
    const { showToast } = useToast();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<storeUpdateAreaViewSchemaType>({
        resolver: zodResolver(storeUpdateAreaViewSchema),
    });

    useEffect(() => {
        if (id && name && email && number) {
            reset({
                id,
                name,
                email,
                number
            });
        }
    }, [id, email, name, number, reset]);

    async function onSubmit(data: storeUpdateAreaViewSchemaType) {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        showToast({
            title: "Sucesso",
            type: "success",
            message: "Loja Atualizada"
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
                <Input inputKey="id" type="text" label="" {...register("id")} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none"/>
                {errors.id && <p className="text-red-500">{errors.id.message}</p>}
            </div>
            <Button label={isSubmitting ? "Atualizando..." : "Atualizar"} type="submit" className="bg-[color:var(--color-primary)] hover:bg-[#0fdc0f] text-[#111811] mt-2" />
        </form>
    );
}