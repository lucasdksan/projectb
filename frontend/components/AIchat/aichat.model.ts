import type { AIContentResponse, Platform } from "@/backend/schemas/aichat.schema";

export type ChatMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
    image?: string;
    structuredContent?: AIContentResponse;
}

export interface AichatViewProps {
    userName?: string | null;
};

export type ContentMode = "standard" | "viral" | "competitor";

export const PLATFORM_LABELS: Record<Platform, string> = {
    instagram: "Instagram",
    facebook: "Facebook",
    tiktok: "TikTok",
    twitter: "Twitter/X",
    linkedin: "LinkedIn",
    marketplace: "Marketplace",
    ecommerce: "E-commerce",
};