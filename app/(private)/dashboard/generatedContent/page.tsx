import { AlertCircle } from "lucide-react";
import ListContentView from "@/frontend/components/ListGeneratedContent/listcontent.view";
import { getCurrentUser } from "@/libs/auth";
import { AIContentService } from "@/backend/services/aicontent.service";
import { GENERATED_CONTENT_PAGE_SIZE } from "@/frontend/components/ListGeneratedContent/listcontent.model";

export default async function GeneratedContentPage() {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <div className="flex flex-col h-[calc(100vh-80px)] animate-in fade-in duration-700">
                <header className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Conteúdos Salvos</h2>
                    <p className="text-gray-500">Visualize e gerencie todos os textos gerados pela IA para suas redes sociais.</p>
                </header>
                <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle className="text-red-500" size={20} />
                    <p className="text-red-400 text-sm">Usuário não autenticado</p>
                </div>
            </div>
        );
    }

    const userId = typeof user.sub === "string" ? parseInt(user.sub, 10) : user.sub;

    const listResult = await AIContentService.listPaginated(userId, {
        page: 1,
        limit: GENERATED_CONTENT_PAGE_SIZE,
    });

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] animate-in fade-in duration-700">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Conteúdos Salvos</h2>
                <p className="text-gray-500">Visualize e gerencie todos os textos gerados pela IA para suas redes sociais.</p>
            </header>

            <ListContentView
                key={`${listResult.pagination.total}-${listResult.pagination.page}`}
                initialContents={listResult.data}
                initialPagination={listResult.pagination}
            />
        </div>
    );
}
