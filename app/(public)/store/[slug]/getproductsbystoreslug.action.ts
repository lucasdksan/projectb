"use server";

import { ProductsController } from "@/backend/controllers/products.controller";
import { listProductsByStoreSlugSchema } from "@/backend/schemas/products.schema";

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ProductListItem {
    id: number;
    name: string;
    price: number;
    slug: string;
    images: { url: string }[];
}

export type GetProductsByStoreSlugActionResult =
    | { success: true; data: { products: ProductListItem[]; pagination: PaginationInfo }; errors: null }
    | { success: false; data: null; errors: Record<string, string[] | undefined> };

export async function getProductsByStoreSlugAction(
    storeSlug: string,
    page = 1,
    limit = 10,
    search?: string
): Promise<GetProductsByStoreSlugActionResult> {
    try {
        const parsed = listProductsByStoreSlugSchema.safeParse({
            storeSlug: storeSlug?.trim(),
            page,
            limit,
            search: search?.trim() || undefined,
        });

        if (!parsed.success) {
            return {
                success: false,
                data: null,
                errors: parsed.error.flatten().fieldErrors,
            };
        }

        const result = await ProductsController.listProductsByStoreSlug(parsed.data);

        if (!result) {
            return {
                success: false,
                data: null,
                errors: {
                    global: ["Loja não encontrada"],
                },
            };
        }

        const products: ProductListItem[] = result.data.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            slug: p.slug,
            images: p.images.map((img) => ({ url: img.url })),
        }));

        return {
            success: true,
            data: {
                products,
                pagination: result.pagination,
            },
            errors: null,
        };
    } catch (error) {
        console.error("Erro ao buscar produtos da loja:", error);
        return {
            success: false,
            data: null,
            errors: {
                global: [
                    error instanceof Error
                        ? error.message
                        : "Erro ao buscar produtos",
                ],
            },
        };
    }
}
