import { AlertCircle } from "lucide-react";
import ListContentView from "@/frontend/components/ListGeneratedContent/listcontent.view";
import { getGeneratedContentAction } from "./getgeneratedcontent.action";

export default async function GeneratedContentPage() {
    const result = await getGeneratedContentAction();

    const contents = result.success ? result.data.contents : [];
    const errorMessage = !result.success ? result.errors?.global?.[0] : null;

    return(
        <div className="flex flex-col h-[calc(100vh-80px)] animate-in fade-in duration-700">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Conteúdos Salvos</h2>
                <p className="text-gray-500">Visualize e gerencie todos os textos gerados pela IA para suas redes sociais.</p>
            </header>

            {errorMessage && (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle className="text-red-500" size={20} />
                    <p className="text-red-400 text-sm">{errorMessage}</p>
                </div>
            )}

            <ListContentView contents={contents} />
        </div>
    );
}