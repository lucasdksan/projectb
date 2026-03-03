"use server";

import { ProductsController } from "@/backend/controllers/products.controller";

export type GetProductActionResult =
    | { success: true; data: NonNullable<Awaited<ReturnType<typeof ProductsController.getProduct>>>; errors: null }
    | { success: false; data: null; errors: Record<string, string[] | undefined> };

export async function getProductAction(slug: number): Promise<GetProductActionResult> {
    try {
        const product = await ProductsController.getProduct(slug);

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
            data: product,
            errors: null,
        };
    } catch (error) {
        console.error("Erro ao obter produto:", error);
        return {
            success: false,
            data: null,
            errors: {
                global: [error instanceof Error ? error.message : "Erro ao obter produto"],
            },
        };
    }
}