import ProfileAreaView from "@/frontend/components/ProfileArea/profilearea.view";
import { getCurrentUser } from "@/libs/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const user = await getCurrentUser();

    if (!user) redirect("/login");

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] animate-in fade-in duration-700">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Configurações</h2>
                <p className="text-gray-500">Gerencie suas configurações de conta.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProfileAreaView profile={{ name: user.name, email: user.email }} />
            </div>
        </div>
    )
}