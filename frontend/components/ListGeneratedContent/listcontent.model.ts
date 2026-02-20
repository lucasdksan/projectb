import { Platform } from "@/backend/schemas/aichat.schema";
import { ContentAI } from "@prisma/client";

export const LIST_PLATFORMS: Record<Platform, string> = {
    instagram: "Instagram",
    facebook: "Facebook",
    tiktok: "TikTok",
    twitter: "Twitter/X",
    linkedin: "LinkedIn",
    marketplace: "Marketplace",
    ecommerce: "E-commerce",
};

export type FilterPlatform = "Todos" | Platform;
export interface ListContentProps {
    contents: ContentAI[];
}