"use server";

import { getCurrentUser } from "@/libs/auth";
import { getActionErrorMessage } from "@/libs/action-error";
import { PostStudioService } from "@/backend/services/poststudio.service";
import { postStudioChatGenerateSchema } from "@/backend/schemas/poststudio.schema";

export type PostStudioChatActionResult =
    | { success: true; data: string; kind: "prompt" | "image" }
    | { success: false; errors: Record<string, string[] | undefined> };

export async function postStudioChatGenerateAction(
    _prevState: PostStudioChatActionResult | null,
    formData: FormData
): Promise<PostStudioChatActionResult> {
    const guidedRaw = formData.get("guidedAnswers");
    let guidedAnswers: unknown;
    if (typeof guidedRaw === "string" && guidedRaw.trim()) {
        try {
            guidedAnswers = JSON.parse(guidedRaw) as unknown;
        } catch {
            return {
                success: false,
                errors: { guidedAnswers: ["Respostas guiadas inválidas"] },
            };
        }
    }

    const raw = {
        image: formData.get("image"),
        mode: formData.get("mode"),
        outputType: formData.get("outputType"),
        guidedAnswers,
        freeText: formData.get("freeText") || undefined,
        extraNotes: formData.get("extraNotes") || undefined,
    };

    const parsed = postStudioChatGenerateSchema.safeParse(raw);

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    try {
        const user = await getCurrentUser();
        if (!user) {
            return {
                success: false,
                errors: { global: ["Usuário não autenticado"] },
            };
        }

        const result = await PostStudioService.generateFromChat(parsed.data);

        return {
            success: true,
            data: result.data,
            kind: parsed.data.outputType,
        };
    } catch (error) {
        console.error("Erro Post Studio Chat:", error);
        return {
            success: false,
            errors: {
                global: [
                    getActionErrorMessage(
                        error,
                        "Falha ao gerar resultado. Tente novamente.",
                    ),
                ],
            },
        };
    }
}
