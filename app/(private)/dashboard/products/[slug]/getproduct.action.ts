"use server";

import { getActionErrorMessage } from "@/libs/action-error";
import { ProductsService } from "@/backend/services/products.service";

export type GetProductActionResult =
    | {
          success: true;
          data: NonNullable<
              Awaited<ReturnType<typeof ProductsService.getProductById>>
          >;
          errors: null;
      }
    | { success: false; data: null; errors: Record<string, string[] | undefined> };

export async function getProductAction(slug: number): Promise<GetProductActionResult> {
    try {
        const product = await ProductsService.getProductById(slug);

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
                global: [
                    getActionErrorMessage(error, "Erro ao obter produto"),
                ],
            },
        };
    }
}