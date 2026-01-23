"use client";

import { useActionState, useEffect } from "react";
import { createContentAIAction } from "@/app/(private)/dashboard/contentAI/action";
import { jsonContentAIProps } from ".";
import { useToast } from "@/frontend/hooks/useToast";
import Button from "@/frontend/ui/button";

interface SalveContentAIProps extends jsonContentAIProps {
    platform: string;
    storeId: number;
}

const initialState = {
    success: false,
    message: "",
    errors: null,
    contentAI: null,
};

export default function SalveContentAI({ headline, description, cta, hashtags, platform, storeId }: SalveContentAIProps) {
    const { showToast } = useToast();
    
    const [state, formAction, isPending] = useActionState(
        async (prevState: any, formData: FormData) => {
            return await createContentAIAction(formData);
        },
        initialState
    );

    useEffect(() => {
        if (state.message) {
            showToast({
                title: state.success ? "Sucesso" : "Erro",
                message: state.message,
                type: state.success ? "success" : "error",
            });
        }
    }, [state, showToast]);

    return (
        <form action={formAction} className="flex flex-col gap-2">
            <input type="hidden" name="headline" value={headline} />
            <input type="hidden" name="description" value={description} />
            <input type="hidden" name="cta" value={cta} />
            <input type="hidden" name="hashtags" value={hashtags.join(" ")} />
            <input type="hidden" name="platform" value={platform} />
            <input type="hidden" name="storeId" value={storeId} />

            <Button 
                type="submit" 
                disabled={isPending}
                label={isPending ? "Salvando..." : "Salvar Conteúdo"}
                className="bg-primary hover:bg-[#0fdc0f] text-[#111811] w-full sm:w-auto px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-green-500/20 transition-all flex items-center gap-2"
            />
        </form>
    );
}
