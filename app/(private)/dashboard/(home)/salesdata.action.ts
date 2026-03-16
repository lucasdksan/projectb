"use server";

import { getCurrentUser } from "@/libs/auth";
import { OrderController } from "@/backend/controllers/order.controller";
import { StoreController } from "@/backend/controllers/store.controller";

export type SalesDataActionResult =
    | { success: true; data: { orderCount: number; totalRevenue: number } }
    | { success: false; errors: Record<string, string[] | undefined> };

export async function salesDataAction(): Promise<SalesDataActionResult> {
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

        const userId = typeof user.sub === "string" ? parseInt(user.sub, 10) : user.sub;
        const store = await StoreController.getStore(userId);

        if (!store) {
            return {
                success: false,
                errors: {
                    global: ["Nenhuma loja cadastrada. Cadastre uma loja primeiro."],
                },
            };
        }

        const salesData = await OrderController.getSalesData(store.id);

        return {
            success: true,
            data: {
                orderCount: salesData.orderCount,
                totalRevenue: salesData.totalRevenue ?? 0,
            },
        };
    } catch (error) {
        console.error("Erro ao obter dados de vendas:", error);
        return {
            success: false,
            errors: {
                global: [
                    error instanceof Error
                        ? error.message
                        : "Falha ao obter dados de vendas.",
                ],
            },
        };
    }
}
