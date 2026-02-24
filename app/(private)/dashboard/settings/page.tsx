import ProfileAreaView from "@/frontend/components/ProfileArea/profilearea.view";
import { getCurrentUser } from "@/libs/auth";
import { redirect } from "next/navigation";
import { getStoreAction } from "./getstore.action";
import StoreAreaView from "@/frontend/components/StoreArea/storearea.view";

export default async function SettingsPage() {
    const user = await getCurrentUser();
    const result = await getStoreAction();
    
    const { success, data } = result;

    if (!user) redirect("/login");
    if (!success || !data) redirect("/dashboard");   

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] animate-in fade-in duration-700">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Configurações</h2>
                <p className="text-gray-500">Gerencie suas configurações de conta.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProfileAreaView profile={{ name: user.name, email: user.email }} />
                <StoreAreaView store={data.store} />
            </div>
        </div>
    )
}