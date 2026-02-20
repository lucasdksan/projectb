import type { ChangeEvent } from "react";
import { Clapperboard, Zap, Crown, Route, type LucideIcon } from "lucide-react";

export const STYLES: { id: string; name: string; Icon: LucideIcon; desc: string }[] = [
    { id: "minimalist", name: "Minimalist White", Icon: Clapperboard, desc: "Fundo limpo e sofisticado" },
    { id: "cyberpunk", name: "Neon Cyber", Icon: Zap, desc: "Cores vibrantes e luzes neon" },
    { id: "luxury", name: "Premium Gold", Icon: Crown, desc: "Estética luxuosa e sombras suaves" },
    { id: "streetwear", name: "Urban Street", Icon: Route, desc: "Estilo rústico e texturas urbanas" },
];

export type StudioAreaState = {
    success: boolean;
    errors: Record<string, string[] | undefined>;
    data: string;
};

export const initialState = {
    success: false as const,
    errors: {} as Record<string, string[] | undefined>,
};

/** Estado e comandos expostos pelo ViewModel para a View (MVVM). */
export type StudioAreaViewModelShape = {
    state: StudioAreaState;
    formAction: (formData: FormData) => void;
    isPending: boolean;
    selectedImage: string | null;
    handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
    downloadImage: () => void;
    openFileDialog: (input: HTMLInputElement | null) => void;
};