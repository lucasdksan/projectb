"use client";

import { useState, useMemo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { Paperclip, Send, RefreshCw, Download, Copy, Check } from "lucide-react";
import { usePostStudioChatViewModel } from "./poststudiochat.viewmodel";

/** Extrai o texto principal para copiar (bloco ``` do markdown) e o restante como nota. */
function extractCopyablePrompt(markdown: string): { prompt: string; note: string } {
    const blocks: string[] = [];
    const re = /```(?:[a-zA-Z0-9]*)?\s*\n?([\s\S]*?)```/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(markdown)) !== null) {
        const inner = m[1]?.trim();
        if (inner) blocks.push(inner);
    }
    let prompt = "";
    if (blocks.length > 0) {
        prompt = blocks.reduce((a, b) => (b.length > a.length ? b : a), blocks[0]);
    }
    let note = markdown;
    note = note.replace(/```(?:[a-zA-Z0-9]*)?\s*\n?[\s\S]*?```/g, "").trim();
    note = note.replace(/^#{1,6}\s*Prompt sugerido\s*$/gim, "").trim();

    if (!prompt) {
        prompt = markdown
            .replace(/^#{1,6}\s+[^\n]+\n?/gm, "")
            .replace(/\*\*([^*]+)\*\*/g, "$1")
            .replace(/`([^`]+)`/g, "$1")
            .trim();
        note = "";
    }

    return { prompt, note };
}

const markdownComponents: Components = {
    h1: ({ children }) => <h1 className="text-lg font-bold text-white mt-4 mb-2 first:mt-0">{children}</h1>,
    h2: ({ children }) => <h2 className="text-base font-bold text-white/95 mt-4 mb-2 first:mt-0">{children}</h2>,
    h3: ({ children }) => <h3 className="text-sm font-semibold text-white/90 mt-3 mb-1.5">{children}</h3>,
    p: ({ children }) => <p className="text-sm text-gray-300 mb-2 last:mb-0 leading-relaxed">{children}</p>,
    strong: ({ children }) => <strong className="font-semibold text-white/95">{children}</strong>,
    em: ({ children }) => <em className="text-gray-400 italic">{children}</em>,
    ul: ({ children }) => (
        <ul className="list-disc list-outside text-sm text-gray-300 space-y-1 my-2 ml-4 [&_ul]:list-[circle] [&_ul]:ml-4">
            {children}
        </ul>
    ),
    ol: ({ children }) => (
        <ol className="list-decimal list-outside text-sm text-gray-300 space-y-1 my-2 ml-4 [&_ol]:ml-6">{children}</ol>
    ),
    li: ({ children }) => (
        <li className="text-gray-300 leading-relaxed pl-1 marker:text-[#00ff41]/70">{children}</li>
    ),
    blockquote: ({ children }) => (
        <blockquote className="border-l-2 border-[#00ff41]/50 pl-4 my-2 text-gray-400 italic">{children}</blockquote>
    ),
    hr: () => <hr className="border-white/10 my-3" />,
    pre: ({ children }) => (
        <pre className="bg-white/5 rounded-lg p-3 overflow-x-auto my-2 text-xs text-gray-300">{children}</pre>
    ),
    code: ({ className, children }) => (
        <code
            className={
                className
                    ? "text-xs text-gray-300 font-mono"
                    : "text-xs bg-white/10 rounded px-1.5 py-0.5 text-[#00ff41]/90 font-mono"
            }
        >
            {children}
        </code>
    ),
};

function PromptResultCard({ content }: { content: string }) {
    const { prompt, note } = useMemo(() => extractCopyablePrompt(content), [content]);
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        const text = prompt || content;
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* ignore */
        }
    }, [prompt, content]);

    return (
        <div className="space-y-3 w-full max-w-xl">
            <div className="rounded-xl border border-white/10 bg-[#1e1e1e] overflow-hidden shadow-lg">
                <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-white/10 bg-[#252525]">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base shrink-0" aria-hidden>
                            🤖
                        </span>
                        <span className="text-sm font-semibold text-white">Prompt sugerido</span>
                    </div>
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-colors"
                        title="Copiar prompt"
                    >
                        {copied ? (
                            <>
                                <Check className="w-3.5 h-3.5 text-[#00ff41]" />
                                Copiado
                            </>
                        ) : (
                            <>
                                <Copy className="w-3.5 h-3.5" />
                                Copiar
                            </>
                        )}
                    </button>
                </div>
                <div className="max-h-72 overflow-y-auto p-3">
                    <pre className="text-[13px] leading-relaxed text-gray-100 font-mono whitespace-pre-wrap wrap-break-word m-0">
                        {prompt || content}
                    </pre>
                </div>
            </div>
            {note ? (
                <div className="text-xs text-gray-400 leading-relaxed pl-0.5 [&_p]:my-1.5 [&_p:first-child]:mt-0 [&_h2]:text-xs [&_h2]:font-semibold [&_h2]:text-gray-300 [&_h2]:mt-0">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {note.replace(/<br\s*\/?>/gi, "\n\n")}
                    </ReactMarkdown>
                </div>
            ) : null}
        </div>
    );
}

function ChatMessageBody({
    content,
    role,
}: {
    content: string;
    role: "user" | "assistant";
}) {
    if (role === "assistant") {
        return (
            <div className="poststudio-markdown [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {content}
                </ReactMarkdown>
            </div>
        );
    }
    return <p className="text-sm whitespace-pre-wrap">{content}</p>;
}

export type PostStudioChatViewProps = {
    userName?: string | null;
};

export default function PostStudioChatView({ userName }: PostStudioChatViewProps) {
    const {
        messages,
        input,
        setInput,
        baseImagePreview,
        actionError,
        isLoading: chatBusy,
        messagesEndRef,
        fileInputRef,
        handleImageChange,
        handleSubmit,
        handleQuickReply,
        resetConversation,
        inputPlaceholder,
        canUseTextInput,
        submitDisabled,
        showAttach,
    } = usePostStudioChatViewModel();

    const userInitial = userName?.trim()?.[0]?.toUpperCase() ?? "U";

    const downloadResult = (dataUrl: string) => {
        const a = document.createElement("a");
        a.href = dataUrl;
        // eslint-disable-next-line react-hooks/purity -- invoked only from click handlers; stable filename unnecessary at render time
        a.download = `post-studio-${Date.now()}.png`;
        a.click();
    };

    return (
        <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
            <div className="flex shrink-0 justify-end px-6 pt-2">
                <button
                    type="button"
                    onClick={resetConversation}
                    className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#00ff41] flex items-center gap-2 transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Nova conversa
                </button>
            </div>

            <div className="min-h-0 flex-1 basis-0 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`${
                                msg.role === "assistant" && msg.isPromptResult
                                    ? "max-w-[min(96%,40rem)]"
                                    : "max-w-[85%]"
                            } rounded-2xl px-4 py-3 flex gap-3 ${
                                msg.role === "user"
                                    ? "bg-[#0d2818] border border-[#00ff41]/25 text-white"
                                    : "bg-[#252525] border border-white/10 text-gray-200"
                            }`}
                        >
                            {msg.role === "assistant" && !msg.isLoadingMarker && !msg.isPromptResult && (
                                <span
                                    className="shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-lg"
                                    aria-hidden
                                >
                                    🤖
                                </span>
                            )}
                            <div className="min-w-0 flex-1">
                                {msg.image && (
                                    <img
                                        src={msg.image}
                                        alt=""
                                        className="max-w-[200px] rounded-lg mb-2 border border-white/10"
                                    />
                                )}
                                {msg.role === "assistant" && msg.isPromptResult ? (
                                    <PromptResultCard content={msg.content} />
                                ) : (
                                    <ChatMessageBody content={msg.content} role={msg.role} />
                                )}
                                {msg.resultImage && (
                                    <div className="mt-3 space-y-2">
                                        <img
                                            src={msg.resultImage}
                                            alt="Resultado gerado"
                                            className="w-full max-w-md rounded-xl border border-white/10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => downloadResult(msg.resultImage!)}
                                            className="w-full sm:w-auto px-4 py-2 bg-[#00ff41] text-black text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90"
                                        >
                                            <Download className="w-4 h-4" />
                                            Baixar imagem
                                        </button>
                                    </div>
                                )}
                                {msg.quickReplies && msg.quickReplies.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {msg.quickReplies.map((qr) => (
                                            <button
                                                key={qr.id}
                                                type="button"
                                                disabled={chatBusy}
                                                onClick={() => handleQuickReply(msg.id, qr.id)}
                                                className="px-3 py-2 text-xs font-semibold rounded-xl bg-white/5 border border-white/10 hover:border-[#00ff41]/40 text-gray-300 hover:text-white transition-colors disabled:opacity-40"
                                            >
                                                {qr.label}
                                            </button>
                                        ))}
                                    </div>
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
                <div ref={messagesEndRef} />
            </div>

            <form
                onSubmit={handleSubmit}
                className="mt-auto shrink-0 border-t border-white/5 bg-[#0d0d0d]/80 p-6 backdrop-blur-md"
            >
                <div className="max-w-4xl mx-auto flex flex-col gap-4">
                    {actionError && (
                        <p className="text-sm text-red-400 text-center" role="alert">
                            {actionError}
                        </p>
                    )}
                    <div className="flex justify-between items-center flex-wrap gap-3">
                        {showAttach && baseImagePreview && (
                            <div className="relative inline-flex">
                                <div className="w-10 h-10 rounded-lg border-2 border-[#00ff41] overflow-hidden bg-[#1a1a1a]">
                                    <img src={baseImagePreview} className="w-full h-full object-cover" alt="" />
                                </div>
                            </div>
                        )}
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium ml-auto">
                            Post Studio • Gemini
                        </p>
                    </div>
                    <div
                        className={`flex items-center gap-0 rounded-2xl border-2 bg-[#1a1a1a] overflow-hidden focus-within:border-[#00ff41] transition-colors ${
                            showAttach && !baseImagePreview ? "border-amber-500/50" : "border-[#00ff41]/60"
                        }`}
                    >
                        <input
                            type="file"
                            name="image"
                            hidden
                            ref={fileInputRef}
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={handleImageChange}
                        />
                        {showAttach && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className={`w-12 h-12 shrink-0 ml-2 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors ${
                                    !baseImagePreview ? "text-amber-400" : "text-[#00ff41]"
                                }`}
                                title="Anexar imagem base"
                            >
                                <Paperclip className="w-5 h-5" />
                            </button>
                        )}
                        <input
                            type="text"
                            name="prompt"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={inputPlaceholder}
                            className="flex-1 min-w-0 bg-transparent py-4 px-4 text-white focus:outline-none placeholder-gray-500 disabled:opacity-50"
                            disabled={!canUseTextInput || chatBusy}
                        />
                        <button
                            type="submit"
                            disabled={submitDisabled}
                            className="w-12 h-12 shrink-0 bg-[#00ff41] text-black rounded-xl flex items-center justify-center m-1 hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
