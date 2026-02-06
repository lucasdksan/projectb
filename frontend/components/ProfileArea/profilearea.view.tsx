"use client";

import { User2Icon } from "lucide-react";
import { ProfileAreaProps } from "./profilearea.model";
import { useProfileAreaViewModel } from "./profilearea.viewmodel";

export default function ProfileAreaView({ profile }: ProfileAreaProps) {
    const { name, setName, isLoading, handleUpdateProfile } = useProfileAreaViewModel(profile.name);

    return (
        <section className="bg-[#161616] border border-white/5 p-8 rounded-3xl space-y-8">
            <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                    <User2Icon className="text-xl" />
                </div>
                <h3 className="text-xl font-bold text-white">Perfil Pessoal</h3>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400">Nome Completo</label>
                    <input 
                        type="text" 
                        className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#00ff41]/50 transition-all" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400">E-mail</label>
                    <input 
                        type="email" 
                        className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#00ff41]/50 transition-all" 
                        disabled 
                        defaultValue={profile.email} 
                    />
                </div>
                <button 
                    className="w-full bg-white/5 text-white py-4 rounded-xl font-bold hover:bg-white/10 transition-all border border-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleUpdateProfile}
                    disabled={isLoading}
                >
                    {isLoading ? "Atualizando..." : "Atualizar Perfil"}
                </button>
            </div>
        </section>
    );
}