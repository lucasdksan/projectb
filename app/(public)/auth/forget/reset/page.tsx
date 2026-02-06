import ResetView from "@/frontend/components/FormReset/reset.view";
import { KeyRound } from "lucide-react";

export default function ResetPage() {
    return (
        <>
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-accent/20">
                    <KeyRound className="w-8 h-8 text-black" />
                </div>
                <h1 className="text-3xl font-bold text-white">Resetar Senha</h1>
                <p className="text-gray-500 mt-2">Informe o token recebido por e-mail para resetar sua senha.</p>
            </div>
            <ResetView />
        </>
    )
}