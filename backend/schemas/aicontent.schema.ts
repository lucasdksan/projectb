import z from "zod";
import { SUPPORTED_PLATFORMS } from "./aichat.schema";

export const saveContentSchema = z.object({
    headline: z.string().min(1).max(500),
    description: z.string().min(1).max(5000),
    cta: z.string().min(1).max(500),
    hashtags: z.string().min(1).max(1000),
    platform: z.enum(SUPPORTED_PLATFORMS),
});

export type SaveContentDTO = z.infer<typeof saveContentSchema>;

export type ContentAIResponse = {
    id: number;
    headline: string;
    description: string;
    cta: string;
    hashtags: string;
    platform: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
};
