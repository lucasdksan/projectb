import { useState } from "react";
import { postInstagramAction } from "@/app/(private)/dashboard/contentAI/action";
import Button from "@/frontend/ui/button";
import { useToast } from "@/frontend/hooks/useToast";

interface PostInstagramBtnProps {
    file: File;
    caption: string;
    storeId: number;
}

export default function PostInstagramBtn({ file, caption, storeId }: PostInstagramBtnProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isLoading) return;

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("caption", caption);
            formData.append("storeId", storeId.toString());
            
            const result = await postInstagramAction(formData);

            if (result.success) {
                showToast({
                    title: "Sucesso",
                    message: result.message || "Imagem publicada no Instagram com sucesso!",
                    type: "success",
                });
            } else {
                showToast({
                    title: "Erro",
                    message: result.message || "Erro ao publicar no Instagram",
                    type: "error",
                });
            }
        } catch (error) {
            showToast({
                title: "Erro",
                message: "Ocorreu um erro inesperado ao publicar no Instagram",
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Button 
                type="submit" 
                disabled={isLoading}
                label={isLoading ? "Publicando..." : "Postar no Instagram"} 
                className={`bg-primary hover:bg-[#0fdc0f] text-[#111811] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} 
            >
            </Button>
        </form>
    );
}