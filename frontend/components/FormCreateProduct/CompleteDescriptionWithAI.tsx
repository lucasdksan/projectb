"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/frontend/ui/button";
import { generateDescriptionAction } from "@/app/(private)/dashboard/product/create/action";
import { useToast } from "@/frontend/hooks/useToast";

interface CompleteDescriptionWithAIProps {
    resetDescription: (description: string) => void;
    active: boolean;
    dataProduct?: {
        name: string;
        category: string;
        attributes: {
            kindof: string;
            value: string;
        }[];
    }
}

export default function CompleteDescriptionWithAI({ resetDescription, active, dataProduct }: CompleteDescriptionWithAIProps) {
    const { showToast } = useToast();
    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateDescription = async () => {
        if (!active) {
            setOpenModal(true);
            return;
        }

        if (!dataProduct) return;

        setIsLoading(true);
        try {
            const result = await generateDescriptionAction(dataProduct);

            if (result.success && result.description) {
                resetDescription(result.description);
                showToast({
                    title: "Sucesso",
                    message: result.message || "Descrição gerada com sucesso",
                    type: "success",
                });
            } else {
                showToast({
                    title: "Erro",
                    message: result.message || "Erro ao gerar descrição",
                    type: "error",
                });
            }
        } catch (error) {
            showToast({
                title: "Erro",
                message: "Ocorreu um erro ao chamar a IA",
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Button 
                type="button"
                onClick={handleGenerateDescription} 
                disabled={isLoading}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors flex items-center gap-2" 
                label={isLoading ? "Gerando..." : "Descrição com IA"} 
            />
            { openModal && createPortal(
                <div onClick={() => setOpenModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900">Dados Incompletos</h2>
                            <button
                                onClick={() => setOpenModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-600 leading-relaxed">
                                Para gerar uma descrição usando IA, você precisa preencher o <strong>Nome</strong>, a <strong>Categoria</strong> e adicionar pelo menos um <strong>Atributo</strong> ao produto.
                            </p>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <Button 
                                type="button"
                                onClick={() => setOpenModal(false)} 
                                label="Entendi" 
                                className="bg-primary text-slate-900 hover:bg-[#0fd60f] w-32" 
                            />
                        </div>
                    </div>
                </div>,
                document.body
            ) }
        </>
    );
}
