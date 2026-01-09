"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Button from "@/frontend/ui/button";
import Input from "@/frontend/ui/input";
import { forgetSchema, forgetSchemaType } from "./schema";
import { forgetAction } from "@/app/(public)/auth/forget/action";

export default function FormForget() {
    const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<forgetSchemaType>({
        resolver: zodResolver(forgetSchema),
    });

    async function onSubmit(data: forgetSchemaType) {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const result = await forgetAction(formData);

        if (!result?.success) {
            setServerErrors(result?.errors ?? {});
            return;
        }

        router.push("/auth/forget/reset");
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-8 flex flex-col gap-5">
            <div className="w-full">
                <Input inputKey="email" label="E-mail" type="email" {...register("email")} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" placeholder="exemplo@email.com" />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
            {serverErrors.email && <p className="text-red-500">{serverErrors.email[0]}</p>}
            <Button label={isSubmitting ? "Enviando..." : "Enviar"} type="submit" className="bg-[color:var(--color-primary)] hover:bg-[#0fdc0f] text-[#111811] mt-2" />
        </form>
    );
}