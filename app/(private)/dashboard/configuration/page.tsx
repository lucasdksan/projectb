import ProfileAreaView from "@/frontend/components/ProfileAreaView";
import StoreAreaView from "@/frontend/components/StoreAreaView";

export default async function DashboardConfiguration(){
    return(
        <div className="w-full h-full p-6 flex flex-col gap-3">
            <div className="flex flex-col md:items-start justify-between">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Configurações</h2>
                <p className="text-slate-500 mt-1">Preencha as informações para atualizar seus dados.</p>
            </div>
            <div className="w-full h-full flex flex-col gap-3 lg:grid lg:grid-cols-2">
                <ProfileAreaView />
                <StoreAreaView />
            </div>
        </div>
    );
}