import { getCurrentUser } from "@/libs/auth";
import AichatView from "@/frontend/components/AIchat/aichat.view";

export default async function ContentAIPage() {
    const user = await getCurrentUser();

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] animate-in fade-in duration-700">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Assistente IA</h2>
                <p className="text-gray-500">Crie legendas, anúncios e descrições otimizadas para seus produtos.</p>
            </header>

            <div className="flex-1 bg-[#111] border border-white/5 rounded-3xl flex flex-col overflow-hidden relative">
                <AichatView userName={user?.name ?? undefined} />
            </div>
        </div>
    )
}