import { useActionState, useState, startTransition } from "react";
import {
    FilterPlatform,
    LIST_PLATFORMS,
    ListContentProps,
    GENERATED_CONTENT_PAGE_SIZE,
} from "./listcontent.model";
import { deleteGeneratedContentAction } from "@/app/(private)/dashboard/generatedContent/deletegeneratedcontent.action";
import {
    listGeneratedContentAction,
    ListGeneratedContentActionResult,
} from "@/app/(private)/dashboard/generatedContent/listgeneratedcontent.action";
import { useRouter } from "next/navigation";
import type { PaginationInfo } from "@/app/(private)/dashboard/products/listproducts.action";

const DEFAULT_PAGINATION: PaginationInfo = {
    page: 1,
    limit: GENERATED_CONTENT_PAGE_SIZE,
    total: 0,
    totalPages: 0,
};

function buildInitialState(
    initialContents: ListContentProps["initialContents"],
    initialPagination: PaginationInfo
): ListGeneratedContentActionResult {
    return {
        success: true,
        data: {
            contents: initialContents,
            pagination: initialPagination,
            filterPlatform: "Todos",
        },
    };
}

export default function useListContentViewModel({
    initialContents,
    initialPagination,
}: ListContentProps) {
    const router = useRouter();
    const [state, formAction] = useActionState(
        listGeneratedContentAction,
        buildInitialState(initialContents, initialPagination)
    );

    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const platforms: FilterPlatform[] = ["Todos", ...(Object.keys(LIST_PLATFORMS) as FilterPlatform[])];

    const filter: FilterPlatform =
        state.success && state.data?.filterPlatform !== undefined
            ? state.data.filterPlatform
            : "Todos";

    const contents =
        state.success && state.data?.contents ? state.data.contents : [];

    const pagination =
        state.success && state.data?.pagination
            ? state.data.pagination
            : DEFAULT_PAGINATION;

    const selectFilter = (next: FilterPlatform) => {
        const fd = new FormData();
        fd.set("page", "1");
        fd.set("limit", String(pagination.limit));
        if (next !== "Todos") {
            fd.set("platform", next);
        }
        startTransition(() => {
            formAction(fd);
        });
    };

    const goToPage = (page: number) => {
        const fd = new FormData();
        fd.set("page", String(page));
        fd.set("limit", String(pagination.limit));
        if (filter !== "Todos") {
            fd.set("platform", filter);
        }
        startTransition(() => {
            formAction(fd);
        });
    };

    const handleCopy = async (id: number, text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error("Erro ao copiar:", err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja deletar este conteúdo?")) {
            return;
        }

        setDeletingId(id);
        try {
            const result = await deleteGeneratedContentAction(id);

            if (result.success) {
                router.refresh();
            } else {
                const errorMessage = result.errors?.global?.[0] || "Erro ao deletar conteúdo";
                alert(errorMessage);
            }
        } catch (error) {
            console.error("Erro ao deletar:", error);
            alert("Erro ao deletar conteúdo");
        } finally {
            setDeletingId(null);
        }
    };

    const getPlatformLabel = (platform: string): string => {
        return LIST_PLATFORMS[platform as keyof typeof LIST_PLATFORMS] || platform;
    };

    return {
        filter,
        selectFilter,
        goToPage,
        copiedId,
        deletingId,
        platforms,
        contents,
        pagination,
        handleCopy,
        handleDelete,
        getPlatformLabel,
    };
}
