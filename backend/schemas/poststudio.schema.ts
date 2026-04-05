import z from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const STYLES = ["minimalist", "cyberpunk", "luxury", "streetwear"];

const imageBlobSchema = z
    .instanceof(Blob)
    .refine((file) => file.size > 0, "Selecione uma imagem")
    .refine((file) => file.size <= MAX_IMAGE_SIZE, "Imagem deve ter no máximo 5MB")
    .refine(
        (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
        "Formato inválido. Use JPEG, PNG, WebP ou GIF"
    );

export const postStudioSchema = z.object({
    image: imageBlobSchema,
    headline: z.string().min(1).max(500),
    customContext: z.string().optional(),
    style: z.enum(STYLES),
});

export type PostStudioDTO = z.infer<typeof postStudioSchema>;

export const guidedAnswersSchema = z.object({
    imageType: z.string().min(1),
    purpose: z.string().min(1),
    emotion: z.string().min(1),
    aestheticRef: z.string().min(1),
    aspectRatio: z.string().min(1),
    shotAngle: z.string().min(1),
    shotDistance: z.string().min(1),
    lightingFeel: z.string().min(1),
});

export type GuidedAnswers = z.infer<typeof guidedAnswersSchema>;

export const postStudioChatGenerateSchema = z
    .object({
        image: imageBlobSchema,
        mode: z.enum(["guided", "free"]),
        outputType: z.enum(["prompt", "image"]),
        guidedAnswers: guidedAnswersSchema.optional(),
        freeText: z.string().max(4000).optional(),
        /** Instruções extras semi-livres (ex.: trocar manequins por pessoas) */
        extraNotes: z.string().max(2000).optional(),
    })
    .superRefine((data, ctx) => {
        if (data.mode === "guided") {
            if (!data.guidedAnswers) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Respostas do modo guiado são obrigatórias",
                    path: ["guidedAnswers"],
                });
            }
        }
        if (data.mode === "free") {
            const t = data.freeText?.trim();
            if (!t) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Descreva sua ideia no modo livre",
                    path: ["freeText"],
                });
            }
        }
    });

export type PostStudioChatGenerateDTO = z.infer<typeof postStudioChatGenerateSchema>;