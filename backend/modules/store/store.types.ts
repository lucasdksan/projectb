import z from "zod";

export const createStoreSchema = z.object({
    name: z.string(),
    email: z.string(),
    number: z.string(),
    userId: z.number(),
});

export type createStore = z.infer<typeof createStoreSchema>;