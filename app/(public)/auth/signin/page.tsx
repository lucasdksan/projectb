import SigninView from "@/frontend/components/FormSignIn/signin.view";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function SignInPage() {
    return (
        <>
            <div className="text-center mb-10">
                <Link href="/" className="inline-block mb-6">
                    <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-accent/20">
                        <Zap className="w-8 h-8 text-black" />
                    </div>
                </Link>
                <h1 className="text-3xl font-bold text-white">Bem-vindo</h1>
                <p className="text-gray-500 mt-2">Gerencie seus produtos e vendas com IA</p>
            </div>
            <SigninView />
            <div className="mt-10 text-center">
                <p className="text-gray-500">
                    Não tem uma conta?{' '}
                    <Link href="/auth/signup" className="text-accent font-bold hover:underline">Criar conta</Link>
                </p>
            </div>
        </>
    );
}