import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ResetModelType, resetModel } from "./reset.model";
import { resetAction } from "@/app/(public)/auth/forget/reset/reset.action";

export default function useResetViewModel() {
    const router = useRouter();
    const form = useForm<ResetModelType>({
        resolver: zodResolver(resetModel),
    });

    async function submit(data: ResetModelType) {
        const result = await resetAction(data);

        if (!result.success && result.errors) {
            Object.entries(result.errors as Record<string, string[]>).forEach(([field, messages]) => {
                if (messages && messages.length > 0) {
                    const errorField = field as keyof ResetModelType;
                    form.setError(errorField, {
                        message: messages[0],
                    })
                }
            })
        }
    
        router.push("/dashboard");
        return result.success;
    }

    return {
        form,
        submit,
        isSubmitting: form.formState.isSubmitting,
    }
}