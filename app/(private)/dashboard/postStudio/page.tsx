import { getCurrentUser } from "@/libs/auth";
import PostStudioChatView from "@/frontend/components/PostStudioChat/poststudiochat.view";

export const dynamic = "force-dynamic";

export default async function PostStudioPage() {
    const user = await getCurrentUser();

    const userName =
        user && typeof user.name === "string" && user.name.trim().length > 0
            ? user.name.trim()
            : undefined;

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] animate-in fade-in duration-700">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Instant Post Studio</h2>
                <p className="text-gray-500">
                    Chat guiado ou livre: envie uma imagem base, refine com perguntas ou texto, e gere um prompt
                    profissional ou a imagem final.
                </p>
            </header>

            <div className="flex-1 min-h-0 bg-[#111] border border-white/5 rounded-3xl flex flex-col overflow-hidden relative">
                <PostStudioChatView userName={userName} />
            </div>
        </div>
    );
}
