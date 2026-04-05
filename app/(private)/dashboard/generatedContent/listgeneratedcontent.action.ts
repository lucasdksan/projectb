"use server";

import { getActionErrorMessage } from "@/libs/action-error";
import { AIContentService } from "@/backend/services/aicontent.service";
import { listContentAISchema } from "@/backend/schemas/aicontent.schema";
import { getCurrentUser } from "@/libs/auth";
import type { ContentAIResponse } from "@/backend/schemas/aicontent.schema";
import type { PaginationInfo } from "@/app/(private)/dashboard/products/listproducts.action";
import type { Platform } from "@/backend/schemas/aichat.schema";
import { GENERATED_CONTENT_PAGE_SIZE } from "@/frontend/components/ListGeneratedContent/listcontent.model";

export type GeneratedContentFilter = "Todos" | Platform;

export type ListGeneratedContentActionResult =
    | {
          success: true;
          data: {
              contents: ContentAIResponse[];
              pagination: PaginationInfo;
              filterPlatform: GeneratedContentFilter;
          };
      }
    | { success: false; errors: Record<string, string[] | undefined>; data: null };

export async function listGeneratedContentAction(
    prevState: ListGeneratedContentActionResult,
    formData: FormData
): Promise<ListGeneratedContentActionResult> {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return {
                success: false,
                errors: { global: ["Usuário não autenticado"] },
                data: null,
            };
        }

        const userId = typeof user.sub === "string" ? parseInt(user.sub, 10) : user.sub;

        const rawPlatform = formData.get("platform")?.toString().trim();
        const rawData = {
            page: Number(formData.get("page") ?? 1),
            limit: Number(formData.get("limit") ?? GENERATED_CONTENT_PAGE_SIZE),
            ...(rawPlatform && rawPlatform !== "Todos" ? { platform: rawPlatform } : {}),
        };

        const parsed = listContentAISchema.safeParse(rawData);

        if (!parsed.success) {
            return {
                success: false,
                errors: parsed.error.flatten().fieldErrors,
                data: null,
            };
        }

        const result = await AIContentService.listPaginated(userId, parsed.data);

        const filterPlatform: GeneratedContentFilter = parsed.data.platform ?? "Todos";

        return {
            success: true,
            data: {
                contents: result.data,
                pagination: result.pagination,
                filterPlatform,
            },
        };
    } catch (error) {
        console.error("Erro ao listar conteúdos:", error);
        return {
            success: false,
            errors: {
                global: [getActionErrorMessage(error, "Falha ao carregar conteúdos.")],
            },
            data: null,
        };
    }
}
