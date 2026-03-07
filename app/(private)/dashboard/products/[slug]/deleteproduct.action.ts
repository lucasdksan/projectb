"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/libs/auth";
import { StoreController } from "@/backend/controllers/store.controller";
import { ProductsController } from "@/backend/controllers/products.controller";
import { vercelIntegration } from "@/backend/intagrations/vercel";

export type DeleteProductActionResult =
    | { success: true }
    | { success: false; errors: Record<string, string[] | undefined> };

export async function deleteProductAction(
    productId: number
): Promise<DeleteProductActionResult> {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return {
                success: false,
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
                errors: {
                    global: ["Nenhuma loja cadastrada."],
                },
            };
        }

        const product = await ProductsController.getProduct(productId);

        if (!product || product.storeId !== store.id) {
            return {
                success: false,
                errors: {
                    global: ["Produto não encontrado ou sem permissão para deletar."],
                },
            };
        }

        if (product.images?.length) {
            await Promise.allSettled(
                product.images.map((img) => vercelIntegration.blob.delete(img.url))
            );
        }

        await ProductsController.deleteProduct(productId, store.id);

        return { success: true };
    } catch (error) {
        return {
            success: false,
            errors: {
                global: [
                    error instanceof Error
                        ? error.message
                        : "Erro ao deletar produto",
                ],
            },
        };
    }
}
