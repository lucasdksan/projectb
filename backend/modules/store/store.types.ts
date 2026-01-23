import z from "zod";

export const createStoreSchema = z.object({
    name: z.string(),
    email: z.string(),
    number: z.string(),
    userId: z.number(),
});

export const createInstagramConfigSchema = z.object({
    token: z.string(),
    userInstagramId: z.string(),
    storeId: z.number(),
});

export type createStore = z.infer<typeof createStoreSchema>;
export type createInstagramConfig = z.infer<typeof createInstagramConfigSchema>;