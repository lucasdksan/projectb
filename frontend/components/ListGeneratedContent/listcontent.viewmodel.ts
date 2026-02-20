import { useState, useMemo } from "react";
import { FilterPlatform, LIST_PLATFORMS, ListContentProps } from "./listcontent.model";
import { deleteGeneratedContentAction } from "@/app/(private)/dashboard/generatedContent/deletegeneratedcontent.action";
import { useRouter } from "next/navigation";

export default function useListContentViewModel({ contents }: ListContentProps) {
    const router = useRouter();
    const [filter, setFilter] = useState<FilterPlatform>("Todos");
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    
    const platforms: FilterPlatform[] = ["Todos", ...Object.keys(LIST_PLATFORMS) as FilterPlatform[]];

    const filteredData = useMemo(() => {
        if (filter === "Todos") return contents;
        return contents.filter(item => item.platform === filter);
    }, [contents, filter]);

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
        setFilter,
        copiedId,
        deletingId,
        platforms,
        filteredData,
        handleCopy,
        handleDelete,
        getPlatformLabel,
    };
}