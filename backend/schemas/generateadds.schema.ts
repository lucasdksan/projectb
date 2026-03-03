import z from "zod";
import { SUPPORTED_PLATFORMS } from "./aichat.schema";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const imageBlobSchema = z
    .instanceof(Blob)
    .refine((file) => file.size > 0, "Selecione uma imagem válida")
    .refine((file) => file.size <= MAX_IMAGE_SIZE, "Imagem deve ter no máximo 5MB")
    .refine(
        (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
        "Formato inválido. Use JPEG, PNG, WebP ou GIF"
    );

export const generateAddsSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().optional(),
    price: z.number().min(0.01, "Preço deve ser maior que zero"),
    stock: z.number().int().min(0, "Estoque deve ser zero ou maior"),
    image: imageBlobSchema.optional(),
    imageUrl: z.string().url().optional(),
});

export const generateAddsFormSchema = generateAddsSchema.extend({
    price: z.coerce.number().min(0.01, "Preço deve ser maior que zero"),
    stock: z.coerce.number().int().min(0, "Estoque deve ser zero ou maior"),
});

export type GenerateAddsDTO = z.infer<typeof generateAddsSchema>;

export const generateAddsResponseSchema = z.object({
    headline: z.string().min(1),
    description: z.string().min(1),
    cta: z.string().min(1),
    hashtags: z.string().min(1),
    platform: z.enum(SUPPORTED_PLATFORMS),
});

export type GenerateAddsResponse = z.infer<typeof generateAddsResponseSchema>;

export type GenerateAddsResult = GenerateAddsResponse | { raw: string };