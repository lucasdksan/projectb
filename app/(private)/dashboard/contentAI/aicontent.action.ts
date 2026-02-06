"use server";

import { AIContentController } from "@/backend/controllers/aicontent.controller";
import { saveContentSchema, type SaveContentDTO } from "@/backend/schemas/aicontent.schema";
import { getCurrentUser } from "@/libs/auth";

export type SaveContentActionResult =
    | { success: true; data: { id: number } }
    | { success: false; errors: Record<string, string[] | undefined> };

export type ListContentActionResult =
    | { success: true; data: { contents: Awaited<ReturnType<typeof AIContentController.list>> } }
    | { success: false; errors: Record<string, string[] | undefined> };

export type DeleteContentActionResult = 
    | { success: true }
    | { success: false; errors: Record<string, string[] | undefined> };

export async function saveContentAction(
    content: SaveContentDTO
): Promise<SaveContentActionResult> {
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

        const validated = saveContentSchema.safeParse(content);

        if (!validated.success) {
            return { 
                success: false, 
                errors: validated.error.flatten().fieldErrors 
            };
        }

        const userId = typeof user.sub === "string" ? parseInt(user.sub, 10) : user.sub;
        const saved = await AIContentController.save(validated.data, userId);
        
        return { 
            success: true, 
            data: { id: saved.id } 
        };
    } catch (error) {
        console.error("Erro ao salvar conteúdo:", error);
        return { 
            success: false, 
            errors: { 
                global: [error instanceof Error ? error.message : "Falha ao salvar conteúdo. Tente novamente."] 
            } 
        };
    }
}

export async function listSavedContentsAction(): Promise<ListContentActionResult> {
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
        const contents = await AIContentController.list(userId);
        
        return { 
            success: true, 
            data: { contents: contents || [] } 
        };
    } catch (error) {
        console.error("Erro ao listar conteúdos:", error);
        return { 
            success: false, 
            errors: { 
                global: [error instanceof Error ? error.message : "Falha ao carregar conteúdos."] 
            } 
        };
    }
}

export async function deleteContentAction(id: number): Promise<DeleteContentActionResult> {
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
        await AIContentController.delete(id, userId);
        
        return { success: true };
    } catch (error) {
        console.error("Erro ao deletar conteúdo:", error);
        return { 
            success: false, 
            errors: { 
                global: [error instanceof Error ? error.message : "Falha ao deletar conteúdo."] 
            } 
        };
    }
}
