import ForgetView from "@/frontend/components/FormForget/forget.view";
import Link from "next/link";
import { KeyRound } from "lucide-react";

export default function ForgetPage() {
    return (
        <>
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-accent/20">
                    <KeyRound className="w-8 h-8 text-black" />
                </div>
                <h1 className="text-3xl font-bold text-white">Recuperar Senha</h1>
                <p className="text-gray-500 mt-2">Informe seu e-mail para receber as instruções.</p>
            </div>

            <ForgetView />

            <div className="mt-10 text-center">
                <p className="text-gray-500">
                    Lembrou a senha?{' '}
                    <Link href="/auth/signin" className="text-accent font-bold hover:underline">Entrar</Link>
                </p>
            </div>
        </>
    );
}