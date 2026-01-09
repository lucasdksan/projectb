"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useProfileData } from "@/frontend/hooks/useProfileData";
import { profileAreaViewSchema, profileAreaViewSchemaType } from "./schema";
import Input from "@/frontend/ui/input";
import Button from "@/frontend/ui/button";

export default function ProfileAreaView() {
    const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
    const { email, name } = useProfileData();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<profileAreaViewSchemaType>({
        resolver: zodResolver(profileAreaViewSchema),
    });

    useEffect(() => {
        if (name && email) {
            reset({
                name,
                email,
            });
        }
    }, [name, email, reset]);

    async function onSubmit(data: profileAreaViewSchemaType) {
        const formData = new FormData();

        console.log(data)

        Object.entries(data).forEach(([key, value]) => {
            console.log([key, value]);
            formData.append(key, value);
        });

        console.log(formData.values());        
    }

    return (
        <div className="bg-surface rounded-xl p-6 shadow-sm border border-[#e5e7eb]">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#f0f4f0]">
                <span className="text-text-main text-lg font-bold">Informações pessoais</span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
                <div className="w-full">
                    <Input inputKey="name" type="text" label="Nome Completo" {...register("name")} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" placeholder="Fulano de Tal" />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>
                <div className="w-full">
                    <Input inputKey="email" type="email" label="E-mail" {...register("email")} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" placeholder="exemplo@email.com" />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>
                <Button label="Editar" type="submit" className="bg-[color:var(--color-primary)] hover:bg-[#0fdc0f] text-[#111811] mt-2"  />
            </form>
        </div>
    );
}