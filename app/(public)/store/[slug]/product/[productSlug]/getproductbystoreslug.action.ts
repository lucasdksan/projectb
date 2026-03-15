"use server";

import { ProductsController } from "@/backend/controllers/products.controller";

export interface ProductDetailResult {
    id: number;
    name: string;
    description: string | null;
    price: number;
    slug: string;
    images: { url: string }[];
}

export type GetProductByStoreSlugActionResult =
    | { success: true; data: { product: ProductDetailResult }; errors: null }
    | { success: false; data: null; errors: Record<string, string[] | undefined> };

export async function getProductByStoreSlugAndProductSlugAction(
    storeSlug: string,
    productSlug: string
): Promise<GetProductByStoreSlugActionResult> {
    try {
        const trimmedStoreSlug = storeSlug?.trim();
        const trimmedProductSlug = productSlug?.trim();

        if (!trimmedStoreSlug || !trimmedProductSlug) {
            return {
                success: false,
                data: null,
                errors: {
                    global: ["Slug da loja e do produto são obrigatórios"],
                },
            };
        }

        const product =
            await ProductsController.getProductByStoreSlugAndProductSlug(
                trimmedStoreSlug,
                trimmedProductSlug
            );

        if (!product) {
            return {
                success: false,
                data: null,
                errors: {
                    global: ["Produto não encontrado"],
                },
            };
        }

        return {
            success: true,
            data: {
                product: {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    slug: product.slug,
                    images: product.images.map((img) => ({ url: img.url })),
                },
            },
            errors: null,
        };
    } catch (error) {
        console.error("Erro ao buscar produto:", error);
        return {
            success: false,
            data: null,
            errors: {
                global: [
                    error instanceof Error
                        ? error.message
                        : "Erro ao buscar produto",
                ],
            },
        };
    }
}
