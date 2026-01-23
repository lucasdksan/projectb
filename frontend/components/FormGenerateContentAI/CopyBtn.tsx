import { useToast } from "@/frontend/hooks/useToast";
import Button from "@/frontend/ui/button";

interface CopyBtnProps {
    headline: string;
    description: string;
    cta: string;
    hashtags: string[];
    platform: string;
}

export default function CopyBtn({ headline, description, cta, hashtags, platform }: CopyBtnProps) {
    const { showToast } = useToast();

    const handleCopy = () => {
        navigator.clipboard.writeText(`
            ${platform === "instagram" ? `@${headline}\n\n${description}\n\n${cta}\n\n${hashtags.join(", ").replaceAll(",", " ")}` : `${headline}\n${description}\n${cta}\n${hashtags.join(", ").replaceAll(",", " ")}`}
        `);

        showToast({
            title: "Sucesso",
            message: "Texto copiado para a área de transferência",
            type: "success",
        });
    };

    return (
        <Button 
            onClick={handleCopy}
            label="Copiar Texto Completo" 
            type="button" 
            className="bg-primary hover:bg-[#0fdc0f] text-[#111811]" 
        />
    );
}