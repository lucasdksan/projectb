import { getCurrentUser } from "@/libs/auth";
import { ProductsController } from "@/backend/controllers/products.controller";
import { StoreController } from "@/backend/controllers/store.controller";

export type QuantityActionResult = 
    | { success: true; data: { quantity: number } }
    | { success: false; errors: Record<string, string[] | undefined> };

export async function quantityProductAction(): Promise<QuantityActionResult> {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return {
                success: false,
                errors: {
                    global: ["Usuário não autenticado"]
                }
            };
        }

        const userId = typeof user.sub === "string" ? parseInt(user.sub, 10) : user.sub;
        const store = await StoreController.getStore(userId);

        if (!store) {
            return {
                success: false,
                errors: {
                    global: ["Nenhuma loja cadastrada. Cadastre uma loja primeiro."]
                }
            };
        }

        const quantity = await ProductsController.quantityProducts(store.id);

        return {
            success: true,
            data: { quantity },
        };

    } catch (error) {
        console.error("Erro ao obter quantidade de produtos:", error);
        return {
            success: false,
            errors: {
                global: [error instanceof Error ? error.message : "Falha ao obter quantidade de produtos."]
            }
        };
    }
}