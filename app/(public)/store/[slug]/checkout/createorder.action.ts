"use server";

import { OrderController } from "@/backend/controllers/order.controller";
import { createOrderSchema } from "@/backend/schemas/order.schema";

export type CreateOrderActionResult =
    | { success: true; data: { orderId: number }; errors: null }
    | { success: false; data: null; errors: Record<string, string[] | undefined> };

export async function createOrderAction(
    storeSlug: string,
    customer: {
        fullName: string;
        email: string;
        cep?: string;
        city?: string;
        address?: string;
    },
    items: { productId: number; quantity: number }[]
): Promise<CreateOrderActionResult> {
    try {
        const parsed = createOrderSchema.safeParse({
            storeSlug: storeSlug?.trim(),
            customer: {
                fullName: customer.fullName?.trim(),
                email: customer.email?.trim(),
                cep: customer.cep?.trim() || undefined,
                city: customer.city?.trim() || undefined,
                address: customer.address?.trim() || undefined,
            },
            items: items.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
            })),
        });

        if (!parsed.success) {
            return {
                success: false,
                data: null,
                errors: parsed.error.flatten().fieldErrors,
            };
        }

        const result = await OrderController.createOrder(parsed.data);

        if (!result.success) {
            return {
                success: false,
                data: null,
                errors: {
                    global: [result.error ?? "Erro ao criar pedido"],
                },
            };
        }

        return {
            success: true,
            data: { orderId: result.orderId! },
            errors: null,
        };
    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        return {
            success: false,
            data: null,
            errors: {
                global: [
                    error instanceof Error
                        ? error.message
                        : "Erro ao criar pedido",
                ],
            },
        };
    }
}
