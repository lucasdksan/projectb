"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/libs/auth";
import { StoreController } from "@/backend/controllers/store.controller";
import { ProductsController } from "@/backend/controllers/products.controller";
import { updateProductSchema } from "@/backend/schemas/products.schema";
import { vercelIntegration } from "@/backend/intagrations/vercel";

const updateProductActionSchema = updateProductSchema
    .omit({ imageUrls: true })
    .extend({
        productId: z.coerce.number().int().min(1, "ID do produto é obrigatório"),
        price: z.coerce.number().min(0.01, "Preço deve ser maior que zero"),
        stock: z.coerce.number().int().min(0, "Estoque deve ser zero ou maior"),
    });

export type UpdateProductActionResult =
    | { success: true; data: null; errors: null }
    | { success: false; errors: Record<string, string[] | undefined>; data: null };

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export async function updateProductAction(
    formData: FormData
): Promise<UpdateProductActionResult> {
    const productId = formData.get("productId");
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const stock = formData.get("stock");
    const isActive = formData.get("isActive");
    const image = formData.get("image");

    const parsed = updateProductActionSchema.safeParse({
        productId,
        name,
        description: description || undefined,
        price,
        stock,
        isActive: isActive === "true" || isActive === "on",
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

    if (image instanceof File && image.size > 0) {
        if (!ACCEPTED_IMAGE_TYPES.includes(image.type)) {
            return {
                success: false,
                data: null,
                errors: {
                    image: ["Formato inválido. Use JPEG, PNG ou WebP."],
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
                    global: ["Nenhuma loja cadastrada."],
                },
            };
        }

        const product = await ProductsController.getProduct(parsed.data.productId);

        if (!product || product.storeId !== store.id) {
            return {
                success: false,
                data: null,
                errors: {
                    global: ["Produto não encontrado ou sem permissão para editar."],
                },
            };
        }

        let imageUrls: string[] = [];

        if (image instanceof File && image.size > 0) {
            const url = await vercelIntegration.blob.upload(image);
            imageUrls = [url];
        } else if (product.images?.length) {
            imageUrls = product.images.map((img) => img.url);
        }

        await ProductsController.updateProduct(
            parsed.data.productId,
            store.id,
            {
                name: parsed.data.name,
                description: parsed.data.description ?? "",
                price: parsed.data.price,
                stock: parsed.data.stock,
                imageUrls,
                isActive: parsed.data.isActive,
            }
        );

        revalidateTag("product-suggestions", "max");

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
                        : "Erro ao atualizar produto",
                ],
            },
        };
    }
}
