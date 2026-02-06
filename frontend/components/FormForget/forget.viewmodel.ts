import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgetModelType, forgetModel } from "./forget.model";
import { forgetAction } from "@/app/(public)/auth/forget/forget.action";
import { useRouter } from "next/navigation";

 export default function useForgetViewModel() {    
    const router = useRouter();
    const form = useForm<ForgetModelType>({
        resolver: zodResolver(forgetModel),
    });

    async function submit(data: ForgetModelType) {
        const result = await forgetAction(data);

        if (!result.success && result.errors) {
            Object.entries(result.errors as Record<string, string[]>).forEach(([field, messages]) => {
                if (messages && messages.length > 0) {
                    const errorField = field as keyof ForgetModelType;
                    form.setError(errorField, {
                        message: messages[0],
                    })
                }
            })
        }

        if (result.success) {
            router.push("/auth/forget/reset");
        }
        
        return result.success;
    }

    return {
        form,
        submit,
        isSubmitting: form.formState.isSubmitting,
    }
 }