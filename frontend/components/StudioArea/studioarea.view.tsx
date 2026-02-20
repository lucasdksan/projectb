"use client";

import { useRef } from "react";
import { Camera, PenTool, Palette, Loader2, ImageIcon, Plus, ListChecks, Download, Cpu } from "lucide-react";
import { useStudioAreaViewModel } from "./studioarea.viewmodel";
import { STYLES } from "./studioarea.model";

function DefaultCard({ children }: { children: React.ReactNode }) {
    return (
        <section className="bg-[#161616] border border-white/5 p-6 rounded-3xl space-y-4">
            {children}
        </section>
    );
}

function FieldError({ messages }: { messages?: string[] }) {
    if (!messages?.length) return null;
    return (
        <p className="text-sm text-red-400 mt-1" role="alert">
            {messages.join(" ")}
        </p>
    );
}

export default function StudioAreaView() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        state,
        formAction,
        isPending,
        selectedImage,
        handleImageChange,
        downloadImage,
        openFileDialog,
    } = useStudioAreaViewModel();

    return (
        <>
            <div className="lg:col-span-4 space-y-6">
                <form action={formAction} className="w-full h-auto space-y-6">
                    <DefaultCard>
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                            <Camera className="text-[#00ff41]" size={20} />
                            1. Foto do Produto
                        </h3>
                        <div
                            onClick={() => openFileDialog(fileInputRef.current)}
                            className={`aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative
                                ${selectedImage ? "border-[#00ff41]/50 bg-[#00ff41]/5" : "border-white/10 bg-[#0d0d0d] hover:border-white/20"}`}
                        >
                            {selectedImage ? (
                                <>
                                    <img src={selectedImage} className="w-full h-full object-cover opacity-80" alt="Selected" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity">
                                        <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg text-white font-bold text-[10px] uppercase tracking-widest">Alterar Imagem</span>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center items-center justify-center flex-col flex p-6">
                                    <Plus className="text-xl text-gray-700 mb-3" size={24} />
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Subir Foto</p>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                name="image"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>
                        <FieldError messages={state.errors?.image} />
                    </DefaultCard>

                    <DefaultCard>
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                            <PenTool className="text-[#00ff41]" size={20} />
                            2. Título / Headline
                        </h3>
                        <label className="block">
                            <input
                                type="text"
                                placeholder="Ex: 50% OFF, Nova Coleção..."
                                className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-[#00ff41]/50 transition-all placeholder-gray-700 text-sm font-medium"
                                name="headline"
                                maxLength={500}
                            />
                            <FieldError messages={state.errors?.headline} />
                        </label>
                    </DefaultCard>

                    <DefaultCard>
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                            <Palette className="text-[#00ff41]" size={20} />
                            3. Contexto opcional
                        </h3>
                        <label className="block">
                            <textarea
                                name="customContext"
                                placeholder="Ex: Fundo com prédios ao pôr do sol, clima urbano"
                                rows={3}
                                className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-[#00ff41]/50 transition-all placeholder-gray-700 text-sm font-medium resize-none"
                            />
                            <FieldError messages={state.errors?.customContext} />
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter mt-2">Dica: Seja específico sobre modelos, cenários ou iluminação.</p>
                        </label>
                    </DefaultCard>

                    <DefaultCard>
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                            <ListChecks className="text-[#00ff41]" size={20} />
                            4. Estilo Visual
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            {STYLES.map(({ id, name, Icon, desc }) => (
                                <label
                                    key={id}
                                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-white/10 hover:border-[#00ff41]/30 cursor-pointer transition-colors has-checked:border-[#00ff41]/50 has-checked:bg-[#00ff41]/5"
                                >
                                    <div className="flex items-start justify-start gap-3">
                                        <input type="radio" name="style" value={id} className="mt-1 accent-[#00ff41]" required />
                                        <div className="min-w-0">
                                            <span className="text-white font-medium block">{name}</span>
                                            <span className="text-gray-500 text-xs">{desc}</span>
                                        </div>
                                    </div>
                                    <Icon className="shrink-0 text-gray-500" size={18} />
                                </label>
                            ))}
                        </div>
                        <FieldError messages={state.errors?.style} />
                    </DefaultCard>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-4 rounded-xl bg-[#00ff41] text-black font-bold flex items-center justify-center gap-2 hover:bg-[#00ff41]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Gerando...
                            </>
                        ) : (
                            "Gerar post"
                        )}
                    </button>
                </form>
            </div>

            <div className="lg:col-span-8">
            <div className="bg-[#0d0d0d] border border-white/5 rounded-[3rem] aspect-square flex flex-col items-center justify-center relative overflow-hidden group shadow-3xl">
                    {state.success && state.data ? (
                        <div className="w-full h-full animate-in zoom-in-95 duration-700">
                            <img src={state.data} className="w-full h-full object-cover" alt="Post gerado" />
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-6 backdrop-blur-md">
                                <div className="text-center space-y-1">
                                    <p className="text-white font-black text-2xl tracking-tighter uppercase">Design Finalizado</p>
                                    <p className="text-gray-400 text-[10px] font-bold tracking-widest">OTIMIZADO PARA INSTAGRAM</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={downloadImage}
                                    className="bg-[#00ff41] text-black px-12 py-5 rounded-2xl font-black text-xl hover:scale-110 transition-transform shadow-2xl shadow-[#00ff41]/40 flex items-center gap-3"
                                >
                                    <Download size={22} />
                                    Baixar Post
                                </button>
                            </div>
                        </div>
                    ) : isPending ? (
                        <div className="text-center space-y-8 p-12 h-full flex flex-col items-center justify-center">
                            <div className="w-32 h-32 bg-[#00ff41]/5 rounded-[3rem] flex items-center justify-center relative">
                                <Cpu className="text-4xl text-[#00ff41] animate-pulse" size={40} />
                                <div className="absolute inset-0 border-2 border-[#00ff41]/20 border-t-[#00ff41] rounded-[3rem] animate-spin" />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-2xl font-black text-white tracking-tighter uppercase">IA em Ação</h4>
                                <p className="text-gray-500 text-sm font-medium max-w-xs mx-auto">Mesclando seu produto com as instruções da cena personalizada...</p>
                            </div>
                            <div className="max-w-xs w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-[#00ff41] animate-loading-bar" />
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-12 max-w-sm h-full flex flex-col items-center justify-center mx-auto">
                            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 text-gray-800 border border-white/5">
                                <ImageIcon className="text-3xl" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Estúdio de Criação</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Suba sua foto e descreva a cena perfeita. Nossa IA cuidará da iluminação, do fundo e dos modelos para você.
                            </p>
                        </div>
                    )}

                    <div className="absolute top-8 left-8 text-[9px] font-black text-gray-800 uppercase tracking-[0.4em] pointer-events-none flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-800 rounded-full" />
                        Render Target // 1:1
                    </div>
                    <div className="absolute bottom-8 right-8 text-[9px] font-black text-gray-800 uppercase tracking-[0.4em] pointer-events-none">
                        Projeto B AI // Studio Output
                    </div>
                </div>
            </div>
        </>
    );
}
