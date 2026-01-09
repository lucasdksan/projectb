"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Button from "@/frontend/ui/button";
import Input from "@/frontend/ui/input";
import { resetSchema, resetSchemaType } from "./schema";
import { resetAction } from "@/app/(public)/auth/forget/reset/action";

export default function FormReset() {
    const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<resetSchemaType>({
        resolver: zodResolver(resetSchema
            
        ),
    });

    async function onSubmit(data: resetSchemaType) {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const result = await resetAction(formData);

        if (!result?.success) {
            setServerErrors(result.errors ?? {});
            return;
        }

        router.push("/dashboard");
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 w-full flex flex-col gap-5">
            <div className="w-full">
                <Input inputKey="email" label="E-mail" type="email" {...register("email")} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" placeholder="exemplo@email.com" />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
            <div className="w-full">
                <Input inputKey="token" label="Token" type="text" {...register("token")} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" placeholder="exemplo@email.com" />
                {errors.token && <p className="text-red-500">{errors.token.message}</p>}
            </div>
            <div className="w-full">
                <Input inputKey="password" type="password" label="Sua senha" {...register("password")} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" placeholder="********" />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
            <div className="w-full">
                <Input inputKey="confirmPassword" type="password" label="Confirme sua senha" {...register("confirmPassword")} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" placeholder="********" />
                {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
            </div>
            {serverErrors.email && <p className="text-red-500">{serverErrors.email[0]}</p>}
            <Button label={isSubmitting ? "Enviando..." : "Enviar"} type="submit" className="bg-[color:var(--color-primary)] hover:bg-[#0fdc0f] text-[#111811] mt-2" />
        </form>
    );
}