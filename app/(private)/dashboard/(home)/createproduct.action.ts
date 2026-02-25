"use server";

import { z } from "zod";
import { getCurrentUser } from "@/libs/auth";
import { StoreController } from "@/backend/controllers/store.controller";
import { ProductsController } from "@/backend/controllers/products.controller";
import { createProductSchema } from "@/backend/schemas/products.schema";
import { vercelIntegration } from "@/backend/intagrations/vercel";

const createProductActionSchema = createProductSchema
    .omit({ storeId: true, imageUrls: true })
    .extend({
        price: z.coerce.number().min(0.01, "Preço deve ser maior que zero"),
        stock: z.coerce.number().int().min(0, "Estoque deve ser zero ou maior"),
    });

export type CreateProductActionResult =
    | { success: true; data: null; errors: null }
    | { success: false; errors: Record<string, string[] | undefined>; data: null };

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export async function createProductAction(
    formData: FormData
): Promise<CreateProductActionResult> {
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const stock = formData.get("stock");
    const image = formData.get("image");

    const parsed = createProductActionSchema.safeParse({
        name,
        description: description || undefined,
        price,
        stock,
    });

    if (!parsed.success) {
        return {
            success: false,
            data: null,
            errors: parsed.error.flatten().fieldErrors as Record<
                string,
                string[] | undefined
            >,
        };
    }

    let imageUrls: string[] = [];

    if (image instanceof File && image.size > 0) {
        if (!ACCEPTED_IMAGE_TYPES.includes(image.type)) {
            return {
                success: false,
                data: null,
                errors: {
                    image: [
                        "Formato inválido. Use JPEG, PNG ou WebP.",
                    ],
                },
            };
        }
        if (image.size > MAX_IMAGE_BYTES) {
            return {
                success: false,
                data: null,
                errors: {
                    image: [`A imagem deve ter no máximo ${MAX_IMAGE_SIZE_MB}MB.`],
                },
            };
        }
    }

    try {
        const user = await getCurrentUser();

        if (!user) {
            return {
                success: false,
                data: null,
                errors: {
                    global: ["Usuário não autenticado"],
                },
            };
        }

        const userId =
            typeof user.sub === "string" ? parseInt(user.sub, 10) : user.sub;
        const store = await StoreController.getStore(userId);

        if (!store) {
            return {
                success: false,
                data: null,
                errors: {
                    global: [
                        "Nenhuma loja cadastrada. Cadastre uma loja primeiro.",
                    ],
                },
            };
        }

        if (image instanceof File && image.size > 0) {
            const url = await vercelIntegration.blob.upload(image);
            imageUrls = [url];
        }

        await ProductsController.createProduct(
            {
                ...parsed.data,
                storeId: store.id,
                imageUrls,
            },
            store.id
        );

        return {
            success: true,
            data: null,
            errors: null,
        };
    } catch (error) {
        return {
            success: false,
            data: null,
            errors: {
                global: [
                    error instanceof Error
                        ? error.message
                        : "Erro ao cadastrar produto",
                ],
            },
        };
    }
}
