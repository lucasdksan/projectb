import SignupView from "@/frontend/components/FormSignUp/signup.view";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function SignupPage() {
    return (
        <>
            <div className="text-center mb-10">
                <Link href="/" className="inline-block mb-6">
                    <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-accent/20">
                        <UserPlus className="w-8 h-8 text-black" />
                    </div>
                </Link>
                <h1 className="text-3xl font-bold text-white">Criar Conta</h1>
                <p className="text-gray-500 mt-2">Comece a gerenciar seu negócio com IA hoje mesmo.</p>
            </div>
            <SignupView />
            <div className="mt-10 text-center">
                <p className="text-gray-500">
                    Já tem uma conta?{' '}
                    <Link href="/auth/signin" className="text-accent font-bold hover:underline">Entrar</Link>
                </p>
            </div>
        </>
    )
}