"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { product } from "@/backend/modules/product/product.types";
import CardIA from "./CardIA";
import { generateContentAIAction } from "@/app/(private)/dashboard/product/[slug]/action";
import { useToast } from "@/frontend/hooks/useToast";

interface GenerateContentAIProps {
    product: product;
}

export default function GenerateContentAI({ product }: GenerateContentAIProps) {
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<string>("");

    const handleGenerate = async (platform: string) => {
        setIsLoading(true);
        setSelectedPlatform(platform);
        
        try {
            const formData = new FormData();
            formData.append("name", product.name);
            formData.append("category", product.category);
            formData.append("price", product.price.toString());
            formData.append("attributes", JSON.stringify(product.attributes || []));
            formData.append("platform", platform);

            const response = await generateContentAIAction(formData);

            if (response.success && response.description) {
                setResult(response.description);
                setIsOpen(true);
            } else {
                showToast({
                    title: "Erro",
                    message: response.message || "Erro ao gerar conteúdo",
                    type: "error",
                });
            }
        } catch (error) {
            showToast({
                title: "Erro",
                message: "Ocorreu um erro inesperado ao gerar o conteúdo",
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (result) {
            navigator.clipboard.writeText(result);
            showToast({
                title: "Sucesso",
                message: "Conteúdo copiado para a área de transferência",
                type: "success",
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <div className="bg-surface rounded-xl p-6 shadow-sm border border-[#e5e8e5] sticky top-24 max-h-[594px]">
            <div className="flex items-center gap-3 mb-2">
                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>Outline-auto-awesome SVG Icon</title><path fill="currentColor" d="m19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25zm0 6l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25zm-7.5-5.5L9 4L6.5 9.5L1 12l5.5 2.5L9 20l2.5-5.5L17 12zm-1.51 3.49L9 15.17l-.99-2.18L5.83 12l2.18-.99L9 8.83l.99 2.18l2.18.99z"/></svg>
                </div>
                <h3 className="text-xl font-bold text-text-main">Gerar Conteúdo</h3>
            </div>
            <p className="text-sm text-text-secondary mb-6 pl-11">Crie textos persuasivos para seus canais de venda em segundos.</p>
            <div className="flex flex-col gap-4">
                <CardIA
                    text="Legenda para post com hashtags virais."
                    title="Instagram"
                    btnText={isLoading && selectedPlatform === "Instagram" ? "Gerando..." : "Gerar Post"}
                    disabled={isLoading}
                    onClick={() => handleGenerate("Instagram")}
                    colorIcon="bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400"
                    icon={
                        <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 7.90001C11.1891 7.90001 10.3964 8.14048 9.72218 8.59099C9.04794 9.0415 8.52243 9.68184 8.21211 10.431C7.90179 11.1802 7.8206 12.0046 7.9788 12.7999C8.13699 13.5952 8.52748 14.3258 9.10088 14.8992C9.67427 15.4725 10.4048 15.863 11.2001 16.0212C11.9955 16.0212 12.8198 16.0982 13.569 15.7879C14.3182 15.4776 14.9585 14.9521 15.409 14.2779C15.8596 13.6036 16.1 12.8109 16.1 12C16.1013 11.4612 15.9962 10.9275 15.7906 10.4295C15.585 9.93142 15.2831 9.47892 14.9021 9.09794C14.5211 8.71695 14.0686 8.415 13.5706 8.20942C13.0725 8.00385 12.5388 7.8987 12 7.90001ZM12 14.67C11.4719 14.67 10.9557 14.5134 10.5166 14.22C10.0776 13.9267 9.73534 13.5097 9.53326 13.0218C9.33117 12.5339 9.2783 11.9971 9.38132 11.4791C9.48434 10.9612 9.73863 10.4854 10.112 10.112C10.4854 9.73863 10.9612 9.48434 11.4791 9.38132C11.9971 9.2783 12.5339 9.33117 13.0218 9.53326C13.5097 9.73534 13.9267 10.0776 14.22 10.5166C14.5134 10.9557 14.67 11.4719 14.67 12C14.67 12.7081 14.3887 13.3873 13.888 13.888C13.3873 14.3887 12.7081 14.67 12 14.67ZM17.23 7.73001C17.23 7.9278 17.1714 8.12114 17.0615 8.28558C16.9516 8.45003 16.7954 8.57821 16.6127 8.65389C16.43 8.72958 16.2289 8.74938 16.0349 8.7108C15.8409 8.67221 15.6628 8.57697 15.5229 8.43712C15.3831 8.29727 15.2878 8.11909 15.2492 7.92511C15.2106 7.73112 15.2304 7.53006 15.3061 7.34733C15.3818 7.16461 15.51 7.00843 15.6744 6.89855C15.8389 6.78866 16.0322 6.73001 16.23 6.73001C16.4952 6.73001 16.7496 6.83537 16.9371 7.02291C17.1247 7.21044 17.23 7.4648 17.23 7.73001ZM19.94 8.73001C19.9691 7.48684 19.5054 6.28261 18.65 5.38001C17.7522 4.5137 16.5474 4.03897 15.3 4.06001C14 4.00001 10 4.00001 8.70001 4.06001C7.45722 4.0331 6.25379 4.49652 5.35001 5.35001C4.49465 6.25261 4.03093 7.45684 4.06001 8.70001C4.00001 10 4.00001 14 4.06001 15.3C4.03093 16.5432 4.49465 17.7474 5.35001 18.65C6.25379 19.5035 7.45722 19.9669 8.70001 19.94C10.02 20.02 13.98 20.02 15.3 19.94C16.5432 19.9691 17.7474 19.5054 18.65 18.65C19.5054 17.7474 19.9691 16.5432 19.94 15.3C20 14 20 10 19.94 8.70001V8.73001ZM18.24 16.73C18.1042 17.074 17.8993 17.3863 17.6378 17.6478C17.3763 17.9093 17.064 18.1142 16.72 18.25C15.1676 18.5639 13.5806 18.6715 12 18.57C10.4228 18.6716 8.83902 18.564 7.29001 18.25C6.94608 18.1142 6.63369 17.9093 6.37223 17.6478C6.11076 17.3863 5.90579 17.074 5.77001 16.73C5.35001 15.67 5.44001 13.17 5.44001 12.01C5.44001 10.85 5.35001 8.34001 5.77001 7.29001C5.90196 6.94268 6.10547 6.62698 6.36733 6.36339C6.62919 6.09981 6.94355 5.89423 7.29001 5.76001C8.83902 5.44599 10.4228 5.33839 12 5.44001C13.5806 5.33856 15.1676 5.44616 16.72 5.76001C17.064 5.89579 17.3763 6.10076 17.6378 6.36223C17.8993 6.62369 18.1042 6.93608 18.24 7.28001C18.66 8.34001 18.56 10.84 18.56 12C18.56 13.16 18.66 15.67 18.24 16.72V16.73Z" fill="#fff"></path> </g>
                        </svg>
                    }
                />
                <CardIA
                    text="Mensagem curta para lista de contatos."
                    title="WhatsApp"
                    btnText={isLoading && selectedPlatform === "WhatsApp" ? "Gerando..." : "Gerar Mensagem"}
                    disabled={isLoading}
                    onClick={() => handleGenerate("WhatsApp")}
                    colorIcon="bg-[#25D366]"
                    icon={
                        <svg viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 19.0001C16.6157 18.9994 19.3559 16.9396 20.2224 13.9468C21.0889 10.954 19.873 7.74874 17.2396 6.0836C14.6062 4.41845 11.1892 4.69428 8.85695 6.76026C6.52471 8.82624 5.8387 12.185 7.174 15.0001L5.5 19.0001L9.892 18.0001C10.9809 18.6564 12.2286 19.0022 13.5 19.0001Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.541 11.0661C10.9717 11.0611 10.5137 10.5965 10.517 10.0271C10.5203 9.45781 10.9836 8.99849 11.5529 9.00013C12.1223 9.00177 12.5829 9.46375 12.583 10.0331C12.5802 10.606 12.1139 11.0683 11.541 11.0661V11.0661Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M14.417 13.918C14.4138 14.3397 14.6652 14.7217 15.0538 14.8854C15.4424 15.0491 15.8914 14.9622 16.1909 14.6653C16.4904 14.3684 16.5811 13.9202 16.4208 13.5302C16.2605 13.1402 15.8807 12.8854 15.459 12.885C14.8861 12.8828 14.4198 13.3451 14.417 13.918V13.918Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M10.5 10.0331C10.486 13.5001 13.8 15.3301 15.459 14.9511" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"></path> </g>
                        </svg>
                    } />
                <CardIA
                    text="Descrição técnica otimizada para SEO."
                    title="Shopee"
                    btnText={isLoading && selectedPlatform === "Shopee" ? "Gerando..." : "Otimizar Texto"}
                    disabled={isLoading}
                    onClick={() => handleGenerate("Shopee")}
                    colorIcon="bg-[#EE4D2D]"
                    icon={
                        <svg width="64px" height="64px" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ffffff">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#ffffff" d="m29.004 157.064 5.987-.399-5.987.399ZM22 52v-6a6 6 0 0 0-5.987 6.4L22 52Zm140.996 105.064-5.987-.399 5.987.399ZM170 52l5.987.4A6 6 0 0 0 170 46v6ZM34.991 156.665 27.987 51.601l-11.974.798 7.005 105.064 11.973-.798Zm133.991.798 7.005-105.064-11.974-.798-7.004 105.064 11.973.798Zm-11.973-.798a10 10 0 0 1-9.978 9.335v12c11.582 0 21.181-8.98 21.951-20.537l-11.973-.798Zm-133.991.798C23.788 169.02 33.387 178 44.968 178v-12a10 10 0 0 1-9.977-9.335l-11.973.798ZM74 48c0-12.15 9.85-22 22-22V14c-18.778 0-34 15.222-34 34h12Zm22-22c12.15 0 22 9.85 22 22h12c0-18.778-15.222-34-34-34v12ZM22 58h148V46H22v12Zm22.969 120H147.03v-12H44.969v12Z"></path><path stroke="#ffffff" strokeLinecap="round" strokeWidth="12" d="M114 84H88c-7.732 0-14 6.268-14 14v0c0 7.732 6.268 14 14 14h4m-2 0h14c7.732 0 14 6.268 14 14v0c0 7.732-6.268 14-14 14H78"></path></g>
                        </svg>
                    } />
            </div>

            {isOpen && createPortal(
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Conteúdo Gerado</h2>
                                <p className="text-sm text-slate-500 mt-1">Plataforma: {selectedPlatform}</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
                                aria-label="Fechar"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto whitespace-pre-wrap text-text-main leading-relaxed">
                            {result}
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold text-sm hover:bg-white transition-colors cursor-pointer"
                            >
                                Fechar
                            </button>
                            <button
                                onClick={copyToClipboard}
                                className="px-6 py-2 rounded-lg bg-primary text-text-main font-bold text-sm hover:bg-primary/90 transition-colors cursor-pointer flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                Copiar Texto
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
