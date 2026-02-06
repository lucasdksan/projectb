import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpModelType, signUpModel } from "./signup.model";
import { signupAction } from "@/app/(public)/auth/signup/signup.action";
import { useRouter } from "next/navigation";

export function useSignupViewModel(){
    const router = useRouter();
    const form = useForm<SignUpModelType>({
        resolver: zodResolver(signUpModel),
    });

    async function submit(data: SignUpModelType) {
        const result = await signupAction(data)

        if (!result.success) {
            Object.entries(result.errors).forEach(([field, messages]) => {
                const errorField = field as keyof SignUpModelType;
                if (messages && messages.length > 0) {
                    form.setError(errorField, {
                        message: messages[0],
                    })
                }
            })
            
            return result.success;
        }
      
        if (result.success) {
            router.push("/dashboard");
        }

        return result.success;
    }

    return {
        form,
        submit,
        isSubmitting: form.formState.isSubmitting,
    }
}