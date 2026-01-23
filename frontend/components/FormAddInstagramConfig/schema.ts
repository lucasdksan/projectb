import { z } from "zod";

export const addInstagramConfigSchema = z.object({
    token: z.string(),
    userInstagramId: z.string(),
    storeId: z.number(),
});

export type addInstagramConfigSchemaType = z.infer<typeof addInstagramConfigSchema>;