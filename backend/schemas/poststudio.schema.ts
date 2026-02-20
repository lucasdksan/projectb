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