import { z } from "zod";

export const sendEmailSchema = z.object({
    from: z.string(),
    to: z.string(),
    subject: z.string(),
    text: z.string(),
    html: z.string(),
});

export type SendEmailDTO = z.infer<typeof sendEmailSchema>;