"use client";

import { AichatViewProps, PLATFORM_LABELS } from "./aichat.model";
import { useAichatViewModel } from "./aichat.viewmodel";
import { SUPPORTED_PLATFORMS, type Platform } from "@/backend/schemas/aichat.schema";
import { Sparkles, Loader2, Save, CheckCircle, X, Paperclip, Send } from "lucide-react";

export default function AichatView({ userName }: AichatViewProps) {
    const {
        messages,
        input,
        setInput,
        selectedImage,
        setSelectedImage,
        selectedPlatform,
        setSelectedPlatform,
        isFirstMessage,
        isLoading,
        isSaving,
        actionError,
        saveSuccess,
        messagesEndRef,
        fileInputRef,
        handleImageChange,
        handleSubmit,
        handleSaveContent,
    } = useAichatViewModel();

    const userInitial = userName?.trim()?.[0]?.toUpperCase() ?? "U";

    return (
        <>
            {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-[#00ff41]/10 rounded-2xl flex items-center justify-center text-[#00ff41] text-2xl animate-pulse">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="max-w-md">
                        <h3 className="text-xl font-bold text-white">Como posso ajudar hoje?</h3>
                        <p className="text-gray-500 mt-2">Suba uma imagem do seu produto e peça para gerar conteúdo para a plataforma selecionada.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-8">
                        <button
                            type="button"
                            onClick={() => setInput("Crie uma descrição atrativa para este produto")}
                            className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-[#00ff41]/40 text-sm text-gray-400 transition-all text-left"
                        >
                            Quero uma descrição...
                        </button>
                        <button
                            type="button"
                            onClick={() => setInput("Crie uma legenda com hashtags para este produto")}
                            className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-[#00ff41]/40 text-sm text-gray-400 transition-all text-left"
                        >
                            Quero uma legenda...
                        </button>
                    </div>
                </div>
            )}

            {messages.length > 0 && (
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-3 flex gap-3 ${
                                    msg.role === "user"
                                        ? "bg-[#0d2818] border border-[#00ff41]/25 text-white"
                                        : "bg-[#252525] border border-white/10 text-gray-200"
                                }`}
                            >
                                {msg.role === "assistant" && (
                                    <span className="shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-lg" aria-hidden>
                                        🤖
                                    </span>
                                )}
                                <div className="min-w-0 flex-1">
                                    {msg.image && (
                                        <img
                                            src={msg.image}
                                            alt=""
                                            className="w-16 h-16 object-cover rounded-lg mb-2"
                                        />
                                    )}
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    {msg.role === "assistant" && msg.structuredContent && (
                                        <button
                                            type="button"
                                            onClick={() => handleSaveContent(msg.id)}
                                            disabled={isSaving}
                                            className="mt-3 px-4 py-2 bg-[#00ff41]/20 hover:bg-[#00ff41]/30 text-[#00ff41] text-xs font-medium rounded-lg border border-[#00ff41]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            {isSaving ? "Salvando..." : "Salvar conteúdo"}
                                        </button>
                                    )}
                                </div>
                            </div>
                            {msg.role === "user" && (
                                <span
                                    className="shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-semibold"
                                    aria-hidden
                                >
                                    {userInitial}
                                </span>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-[#252525] border border-white/10 flex items-center gap-3">
                                <span className="shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-lg" aria-hidden>
                                    🤖
                                </span>
                                <div className="flex items-center gap-1.5 py-1">
                                    <span className="loading-dot w-2 h-2 rounded-full bg-gray-400 block" />
                                    <span className="loading-dot w-2 h-2 rounded-full bg-gray-400 block" />
                                    <span className="loading-dot w-2 h-2 rounded-full bg-gray-400 block" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 bg-[#0d0d0d]/80 backdrop-blur-md border-t border-white/5">
                    <input
                            type="hidden"
                            name="isFirstMessage"
                            value={isFirstMessage ? "true" : "false"}
                        />
                <div className="max-w-4xl mx-auto flex flex-col gap-4">
                    {actionError && (
                        <p className="text-sm text-red-400 text-center" role="alert">
                            {actionError}
                        </p>
                    )}
                    {saveSuccess && (
                        <p className="text-sm text-[#00ff41] text-center" role="status">
                            <CheckCircle className="w-4 h-4 mr-2 inline" />
                            {saveSuccess}
                        </p>
                    )}
                    <div className="flex items-center gap-3 flex-wrap">
                        {selectedImage && (
                            <div className="relative inline-flex">
                                <div className="w-10 h-10 rounded-lg border-2 border-[#00ff41] overflow-hidden bg-[#1a1a1a]">
                                    <img src={selectedImage} className="w-full h-full object-cover" alt="Produto" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
                                    title="Remover imagem"
                                >
                                    <X className="w-2.5 h-2.5" />
                                </button>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-400 font-medium">Plataforma:</label>
                            <select
                                value={selectedPlatform}
                                onChange={(e) => setSelectedPlatform(e.target.value as Platform)}
                                className="bg-[#1a1a1a] text-white text-sm px-3 py-1.5 rounded-lg border border-white/10 focus:border-[#00ff41]/50 focus:outline-none cursor-pointer"
                            >
                                {SUPPORTED_PLATFORMS.map((platform) => (
                                    <option key={platform} value={platform}>
                                        {PLATFORM_LABELS[platform]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={`flex items-center gap-0 rounded-2xl border-2 bg-[#1a1a1a] overflow-hidden focus-within:border-[#00ff41] transition-colors ${isFirstMessage && !selectedImage ? "border-amber-500/50" : "border-[#00ff41]/60"}`}>
                        <input
                            type="file"
                            name="image"
                            hidden
                            ref={fileInputRef}
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={handleImageChange}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-12 h-12 shrink-0 ml-2 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors ${isFirstMessage && !selectedImage ? "text-amber-400" : "text-[#00ff41]"}`}
                            title={isFirstMessage ? "Anexar imagem do produto (obrigatório)" : "Anexar imagem (opcional)"}
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            name="prompt"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isFirstMessage
                                ? (selectedImage ? "O que deseja gerar para este produto?" : "Selecione uma imagem primeiro...")
                                : "Refaça, altere o tom ou peça outra variação..."}
                            className="flex-1 min-w-0 bg-transparent py-4 px-4 text-white focus:outline-none placeholder-gray-500 disabled:opacity-50"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim() || (isFirstMessage && !selectedImage)}
                            className="w-12 h-12 shrink-0 bg-[#00ff41] text-black rounded-xl flex items-center justify-center m-1 hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest font-medium">
                        Gemini AI • {isFirstMessage ? "O uso de imagem é obrigatório na primeira mensagem" : "Imagem opcional nas próximas mensagens"}
                    </p>
                </div>
            </form>
        </>
    );
}
