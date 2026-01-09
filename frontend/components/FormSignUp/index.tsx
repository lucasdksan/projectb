"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Button from "@/frontend/ui/button";
import Input from "@/frontend/ui/input";
import { signUpSchema, signUpSchemaType } from "./schema";
import { signUpAction } from "@/app/(public)/auth/signup/actions";
import { useToast } from "@/frontend/hooks/useToast";
import { useProfileData } from "@/frontend/hooks/useProfileData";

export default function FormSignUp() {
    const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
    const router = useRouter();
    const { showToast } = useToast();
    const { setEmail, setName } = useProfileData();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<signUpSchemaType>({
        resolver: zodResolver(signUpSchema),
    });

    async function onSubmit(data: signUpSchemaType) {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const result = await signUpAction(formData);

        if (!result.success) {
            setServerErrors(result.errors ?? {});
            showToast({
                title: "Erro",
                message: result?.errors?.email?.[0] ?? "Erro ao cadastrar usuário",
                type: "error",
            });
            return;
        }
        
        setName(result.name ?? "");
        setEmail(result.email ?? "");
        router.push("/dashboard");
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-8 flex flex-col gap-5">
            <div className="w-full">
                <Input inputKey="name" type="text" label="Seu nome" {...register("name")} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" placeholder="Fulano de Tal" />
                {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>
            <div className="w-full">
                <Input inputKey="email" type="email" label="Seu e-mail" {...register("email")} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" placeholder="exemplo@email.com" />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
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
            <Button label={isSubmitting ? "Cadastrando..." : "Cadastrar"} type="submit" className="bg-[color:var(--color-primary)] hover:bg-[#0fdc0f] text-[#111811] mt-2" />
        </form>
    );
}