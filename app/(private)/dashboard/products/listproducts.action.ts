"use server";

import { ProductsController } from "@/backend/controllers/products.controller";
import { listProductsSchema } from "@/backend/schemas/products.schema";

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export type ListProductsActionResult =
    | { success: true; data: { products: any[]; pagination: PaginationInfo } }
    | { success: false; errors: Record<string, string[] | undefined>; data: null };

export async function listProductsAction(
    prevState: ListProductsActionResult,
    formData: FormData
): Promise<ListProductsActionResult> {
    const rawData = {
        page: Number(formData.get("page") ?? 1),
        limit: Number(formData.get("limit") ?? 5),
        search: formData.get("search")?.toString() || undefined,
        storeId: Number(formData.get("storeId")),
    };

    const parsed = listProductsSchema.safeParse(rawData);

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
            data: null,
        };
    }

    const result = await ProductsController.listProducts(parsed.data);

    return {
        success: true,
        data: {
            products: result.data,
            pagination: result.pagination,
        },
    };
}