import { redirect } from "next/navigation";
import { getCurrentUser } from "@/libs/auth";
import StoreConfigAreaView from "@/frontend/components/StoreConfigArea/storeconfigarea.view";
import { getStoreConfigAction } from "./getstoreconfig.action";

export default async function StoreConfigPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/auth/signin");

    const result = await getStoreConfigAction();
    if (!result.success) redirect("/dashboard");

    return (
        <div className="flex flex-col">
            <header className="mb-8 shrink-0">
                <h2 className="text-3xl font-bold text-white mb-2">Configurar Loja</h2>
                <p className="text-gray-500">Personalize a identidade visual da sua vitrine pública.</p>
            </header>
            <div className="flex-1 pb-8">
                <StoreConfigAreaView config={result.data.config} />
            </div>
        </div>
    );
}
