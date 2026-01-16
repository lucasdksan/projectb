"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Button from "@/frontend/ui/button";
import Input from "@/frontend/ui/input";
import { forgetSchema, forgetSchemaType } from "./schema";
import { forgetAction } from "@/app/(public)/auth/forget/action";
import { useToast } from "@/frontend/hooks/useToast";

export default function FormForget() {
    const router = useRouter();
    const { showToast } = useToast();
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
            if(result.errors && Object.keys(result.errors).length > 0) {
                Object.entries(result.errors).forEach(([key, value]) => {
                    showToast({
                        title: "Erro",
                        message: value[0] ?? "Erro ao enviar e-mail de recuperação",
                        type: "error",
                    });
                });
            } else {
                showToast({
                    title: "Erro",
                    message: result.message ?? "Erro ao enviar e-mail de recuperação",
                    type: "error",
                });
            }
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
            <Button label={isSubmitting ? "Enviando..." : "Enviar"} type="submit" className="bg-[color:var(--color-primary)] hover:bg-[#0fdc0f] text-[#111811] mt-2" />
        </form>
    );
}