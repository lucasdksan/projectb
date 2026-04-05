import { getCurrentUser } from "@/libs/auth";
import { getActionErrorMessage } from "@/libs/action-error";
import { ProductsService } from "@/backend/services/products.service";
import { StoreService } from "@/backend/services/store.service";

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
        const store = await StoreService.getStore(userId);

        if (!store) {
            return {
                success: false,
                errors: {
                    global: ["Nenhuma loja cadastrada. Cadastre uma loja primeiro."]
                }
            };
        }

        const quantity = await ProductsService.quantityProducts(store.id);

        return {
            success: true,
            data: { quantity },
        };

    } catch (error) {
        console.error("Erro ao obter quantidade de produtos:", error);
        return {
            success: false,
            errors: {
                global: [
                    getActionErrorMessage(
                        error,
                        "Falha ao obter quantidade de produtos.",
                    ),
                ]
            }
        };
    }
}