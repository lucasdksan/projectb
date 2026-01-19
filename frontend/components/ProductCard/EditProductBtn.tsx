"use client";

import { ButtonHTMLAttributes, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import FormEditProduct from "./FormEditProduct";
import { useRouter } from "next/navigation";

interface EditProductBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    productId: number;
}

export default function EditProductBtn({ productId, ...props }: EditProductBtnProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const toggleModal = (e?: React.MouseEvent | React.KeyboardEvent) => {
        if (e) {
            e.stopPropagation();
        }
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleEscape);
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            window.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleSuccess = () => {
        setIsOpen(false);
        router.refresh();
    };

    return (
        <>
            <button
                onClick={toggleModal}
                className="cursor-pointer absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-text-main shadow-sm hover:bg-white transition-colors"
                {...props}
            >
                <span>Editar Produto</span>
            </button>

            {isOpen && createPortal(
                <div
                    onClick={() => toggleModal()}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Editar Produto</h2>
                                <p className="text-xs text-slate-400 font-mono mt-1">ID: #{productId}</p>
                            </div>
                            <button
                                onClick={() => toggleModal()}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
                                aria-label="Fechar"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            <FormEditProduct 
                                productId={productId} 
                                onSuccess={handleSuccess} 
                                onCancel={() => toggleModal()} 
                            />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
