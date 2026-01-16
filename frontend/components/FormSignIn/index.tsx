"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Button from "@/frontend/ui/button";
import Input from "@/frontend/ui/input";
import { signInSchema, signInSchemaType } from "./schema";
import { signInAction } from "@/app/(public)/auth/signin/actions";
import { useToast } from "@/frontend/hooks/useToast";
import { useProfileData } from "@/frontend/hooks/useProfileData";

export default function FormSignIn() {
    const router = useRouter();
    const { showToast } = useToast();
    const { setEmail, setName } = useProfileData();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<signInSchemaType>({
        resolver: zodResolver(signInSchema),
    });

    async function onSubmit(data: signInSchemaType) {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const result = await signInAction(formData);

        if (!result?.success) {
            if(result.errors && Object.keys(result.errors).length > 0) {
                Object.entries(result.errors).forEach(([key, value]) => {
                    showToast({
                        title: "Erro",
                        message: value[0] ?? "Erro ao fazer login",
                        type: "error",
                    });
                });
            } else {
                showToast({
                    title: "Erro",
                    message: result.message ?? "Erro ao fazer login",
                    type: "error",
                });
            }

            return;
        }

        setName(result.user?.name ?? "");
        setEmail(result.user?.email ?? "");
        router.push("/dashboard");
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-8 flex flex-col gap-5">
            <div className="w-full">
                <Input inputKey="email" label="Seu e-mail" type="email" {...register("email")} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" placeholder="exemplo@email.com" />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
            <div className="w-full">
                <Input inputKey="password" type="password" label="Sua senha" {...register("password")} leftLabel={{ classStyle: "text-sm font-semibold text-text-muted hover:text-[color:var(--color-primary)] transition-colors", link: "/auth/forget", label: "Esqueceu?" }} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
            <Button label={isSubmitting ? "Entrando..." : "Entrar"} type="submit" className="bg-[color:var(--color-primary)] hover:bg-[#0fdc0f] text-[#111811] mt-2" />
        </form>
    );
}