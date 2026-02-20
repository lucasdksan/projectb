import z from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const imageBlobSchema = z
    .instanceof(Blob)
    .refine((file) => file.size > 0, "Selecione uma imagem")
    .refine((file) => file.size <= MAX_IMAGE_SIZE, "Imagem deve ter no máximo 5MB")
    .refine(
        (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
        "Formato inválido. Use JPEG, PNG, WebP ou GIF"
    );

const promptSchema = z
    .string()
    .min(1, "Digite o que deseja gerar")
    .max(2000, "Mensagem muito longa");

export const SUPPORTED_PLATFORMS = [
    "instagram",
    "facebook",
    "tiktok",
    "twitter",
    "linkedin",
    "marketplace",
    "ecommerce",
] as const;

export type Platform = (typeof SUPPORTED_PLATFORMS)[number];

export const aiContentResponseSchema = z.object({
    headline: z.string().min(1, "Headline é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    cta: z.string().min(1, "CTA é obrigatório"),
    hashtags: z.string().min(1, "Hashtags são obrigatórias"),
    platform: z.enum(SUPPORTED_PLATFORMS),
});

export type AIContentResponse = z.infer<typeof aiContentResponseSchema>;

export const sendMessageWithImageSchema = z.object({
    prompt: promptSchema,
    image: imageBlobSchema,
});

export const sendMessageWithoutImageSchema = z.object({
    prompt: promptSchema,
});

export type SendMessageWithImageInput = z.infer<typeof sendMessageWithImageSchema>;
export type SendMessageWithoutImageInput = z.infer<typeof sendMessageWithoutImageSchema>;

export const chatMessageSchema = z.object({
    id: z.string(),
    role: z.enum(["user", "assistant"]),
    content: z.string(),
    image: z.string().optional(),
    structuredContent: aiContentResponseSchema.optional(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const chatHistoryItemSchema = z.object({
    role: z.enum(["user", "model"]),
    content: z.string(),
});

export const CONTENT_MODES = ["standard", "viral", "competitor"] as const;
export type ContentMode = (typeof CONTENT_MODES)[number];

export const sendMessageWithContextSchema = z
    .object({
        prompt: promptSchema,
        history: z.array(chatHistoryItemSchema),
        image: imageBlobSchema.optional(),
        platform: z.enum(SUPPORTED_PLATFORMS).optional(),
        mode: z.enum(CONTENT_MODES).optional(),
    })
    .refine(
        (data) => {
            const isFirstMessage = data.history.length === 0;
            if (data.mode === "standard" && isFirstMessage) {
                return data.image != null;
            }
            return true;
        },
        { message: "No modo padrão, a imagem é obrigatória na primeira mensagem.", path: ["image"] }
    );

export type ChatHistoryItem = z.infer<typeof chatHistoryItemSchema>;
export type SendMessageWithContextInput = z.infer<typeof sendMessageWithContextSchema>;
