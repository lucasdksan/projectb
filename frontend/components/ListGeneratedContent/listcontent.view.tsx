"use client";

import { ListContentProps } from "./listcontent.model";
import useListContentViewModel from "./listcontent.viewmodel";
import { Check, Copy, Trash2, PackageOpen } from "lucide-react";

export default function ListContentView(props: ListContentProps) {
    const {
        filter,
        setFilter,
        copiedId,
        deletingId,
        platforms,
        filteredData,
        handleCopy,
        handleDelete,
        getPlatformLabel,
    } = useListContentViewModel(props);

    return (
        <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {platforms.map(p => (
                    <button
                        key={p}
                        onClick={() => setFilter(p)}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
                            filter === p 
                                ? 'bg-[#00ff41] text-black border-[#00ff41]' 
                                : 'bg-white/5 text-gray-400 border-white/10 hover:border-[#00ff41]/50'
                        }`}
                    >
                        {p === "Todos" ? p : getPlatformLabel(p)}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredData.map((item) => (
                    <div key={item.id} className="bg-[#161616] border border-white/5 rounded-3xl p-8 flex flex-col hover:border-[#00ff41]/30 transition-all group relative">
                        <div className="flex justify-between items-start mb-6">
                            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                {getPlatformLabel(item.platform)}
                            </span>
                            <span className="text-[10px] text-gray-600 font-mono">
                                {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#00ff41] transition-colors line-clamp-2">
                            {item.headline}
                        </h3>
                        
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                            {item.description}
                        </p>

                        <div className="space-y-4 pt-6 border-t border-white/5">
                            <div className="bg-[#0a0a0a] rounded-xl p-3 border border-white/5">
                                <p className="text-[10px] text-gray-600 font-bold uppercase mb-1">Call to Action</p>
                                <p className="text-xs text-[#00ff41] font-medium">{item.cta}</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {item.hashtags.split(' ').map((h, i) => (
                                    <span key={i} className="text-[11px] text-emerald-400/60 font-medium">
                                        {h}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button 
                                onClick={() => handleCopy(item.id, `${item.headline}\n\n${item.description}\n\n${item.cta}\n\n${item.hashtags}`)}
                                className="flex-1 bg-white/5 hover:bg-[#00ff41]/10 text-white hover:text-[#00ff41] border border-white/10 hover:border-[#00ff41]/30 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                            >
                                {copiedId === item.id ? <Check size={16} /> : <Copy size={16} />}
                                {copiedId === item.id ? 'Copiado!' : 'Copiar Tudo'}
                            </button>
                            <button 
                                onClick={() => handleDelete(item.id)}
                                disabled={deletingId === item.id}
                                className="w-12 h-12 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-500 border border-white/10 hover:border-red-500/30 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Trash2 size={16} className={deletingId === item.id ? 'animate-pulse' : ''} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredData.length === 0 && (
                <div className="bg-[#161616] border border-dashed border-white/10 rounded-3xl p-20 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-600">
                        <PackageOpen size={32} />
                    </div>
                    <h3 className="text-white font-bold text-lg">Nenhum conteúdo encontrado</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mt-2">Você ainda não tem conteúdos salvos para esta plataforma.</p>
                </div>
            )}
        </div>
    );
}