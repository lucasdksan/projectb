import FormGenerateContentAI from "@/frontend/components/FormGenerateContentAI";
import { getCurrentUser } from "@/libs/auth";
import { redirect } from "next/navigation";
import { searchStoreAction } from "../product/create/action";

export default async function DashboardContentAI() {
    const user = await getCurrentUser();

    if (!user) redirect("/login");

    const { store, success } = await searchStoreAction(String(user.sub));

    if (!success || !store) redirect("/dashboard/store");

    return (
        <div className="w-full h-full p-6 flex flex-col gap-3">
            <div className="flex flex-col md:items-start justify-between">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Gerar Conteúdo com IA</h2>
                <p className="text-slate-500 mt-1">Crie textos persuasivos para seus canais de venda em segundos.</p>
            </div>
            <FormGenerateContentAI storeId={store.id} />
        </div>
    );
}