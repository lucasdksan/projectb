import { Platform } from "@/backend/schemas/aichat.schema";
import { ContentAI } from "@prisma/client";
import type { PaginationInfo } from "@/app/(private)/dashboard/products/listproducts.action";

export const GENERATED_CONTENT_PAGE_SIZE = 2;

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
    initialContents: ContentAI[];
    initialPagination: PaginationInfo;
}