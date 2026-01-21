import Button from "@/frontend/ui/button";

interface CopyBtnProps {
    headline: string;
    description: string;
    cta: string;
    hashtags: string[];
    platform: string;
}

export default function CopyBtn({ headline, description, cta, hashtags, platform }: CopyBtnProps) {

    const handleCopy = () => {
        navigator.clipboard.writeText(`
            ${platform === "instagram" ? `@${headline}\n\n${description}\n\n${cta}\n\n${hashtags.join(", ")}` : `${headline}\n${description}\n${cta}\n${hashtags.join(", ")}`}
        `);
    };

    return (
        <Button 
            onClick={handleCopy}
            label="Copiar Texto Completo" 
            type="button" 
            className="bg-[color:var(--color-primary)] hover:bg-[#0fdc0f] text-[#111811]" 
        />
    );
}