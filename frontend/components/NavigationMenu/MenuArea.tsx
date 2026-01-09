import { logoutAction } from "@/app/(public)/auth/logout/action";
import Link from "next/link";

export interface MenuAreaProps {
    profile: {
        name: string;
        email: string;
    };
};

export default function MenuArea({ profile }: MenuAreaProps){
    return(
        <div className="w-full h-full flex flex-col p-4">
            <div className="flex items-center border-b border-slate-50">
                <h2 className="text-lg font-bold tracking-tight text-slate-900">Projeto B App</h2>
            </div>
            <nav className="flex-1 overflow-y-auto py-6 gap-2 flex flex-col">
                <Link href="/dashboard" className="flex items-center px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors group">Dashboard</Link>
                <Link href="/dashboard" className="flex items-center px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors group">Produtos</Link>
                <Link href="/dashboard/store" className="flex items-center px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors group">Loja</Link>
                <Link href="/dashboard" className="flex items-center px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors group">Conteúdo IA</Link>
                <Link href="/dashboard/configuration" className="flex items-center px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors group">Configurações</Link>
                <form action={logoutAction}>
                    <button className="flex items-center px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors group cursor-pointer w-full" type="submit">Sair</button>
                </form>
            </nav>
            <div className="flex flex-col w-full h-auto items-start justify-start p-4 border-t border-slate-50">
                <span className="text-sm font-semibold text-slate-900">{profile.name}</span>
                <span className="text-xs text-slate-500">{profile.email}</span>
            </div>
        </div>
    );
}