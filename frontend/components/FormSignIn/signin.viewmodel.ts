import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInModelType, signInModel } from "./signin.model";
import { signinAction } from "@/app/(public)/auth/signin/signup.action";
import { useRouter } from "next/navigation";

export function useSigninViewModel(){
    const router = useRouter();
    const form = useForm<SignInModelType>({
        resolver: zodResolver(signInModel),
    });

    async function submit(data: SignInModelType) {
        const result = await signinAction(data);

        if (!result.success) {
            Object.entries(result.errors || {}).forEach(([field, messages]) => {
                const errorField = field as keyof SignInModelType;
                if (messages && messages.length > 0) {
                    form.setError(errorField, {
                        message: messages[0],
                    })
                }
            })
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