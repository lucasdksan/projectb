import z from "zod";

export const createContentAISchema = z.object({
    headline: z.string().min(1),
    description: z.string().min(1),
    cta: z.string().min(1),
    hashtags: z.string().min(1),
    platform: z.string().min(1),
    storeId: z.number(),
});

export type createContentAI = z.infer<typeof createContentAISchema>;