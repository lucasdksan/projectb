import { StoreService } from "@/backend/modules/store/store.service";
import FormAddInstagramConfig from "@/frontend/components/FormAddInstagramConfig";
import FormUpdateStore from "@/frontend/components/FormUpdateStore";
import { getCurrentUser } from "@/libs/auth";
import { redirect } from "next/navigation";
import { getInstagramConfigAction } from "./action";
import WhiteCard from "@/frontend/components/WhiteCard";

export default async function DashboardStore(){
    const user = await getCurrentUser();

    if (!user) redirect("/login");
    
    const store = await StoreService.findByUserId(`${user.sub}`);
    const instagramConfig = await getInstagramConfigAction(store?.id ?? 0);

    return(
        <div className="w-full h-full p-6 flex flex-col gap-3">
            <div className="flex flex-col md:items-start justify-between">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Dados da loja</h2>
                <p className="text-slate-500 mt-1">Preencha as informações para atualizar os dados da loja.</p>
            </div>
            <div className="w-full h-full flex flex-col gap-3 lg:grid lg:grid-cols-2">
                <div className="bg-surface rounded-xl p-6 shadow-sm border border-[#e5e7eb]">
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#f0f4f0]">
                        <span className="text-text-main text-lg font-bold">Informações da Loja</span>
                    </div>
                    { store && (
                        <FormUpdateStore {...store} id={`${store.id}`} />
                    ) }
                </div>
                <div className={`
                    bg-surface rounded-xl p-6 shadow-sm border border-[#e5e7eb]
                    ${instagramConfig.success ? "max-h-[250px]" : ""}
                    `}>
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#f0f4f0]">
                        <span className="text-text-main text-lg font-bold">Configuração do Instagram</span>
                    </div>
                    { store && !instagramConfig.success && <FormAddInstagramConfig storeId={store.id} /> }
                    { store && instagramConfig.success && (
                        <WhiteCard>
                            <div className="flex items-center gap-2">
                                  <span>A loja já possui configuração do Instagram</span>                             
                            </div>
                            <div className="flex items-center gap-2">
                                <span>ID do Usuário: {instagramConfig.instagramConfig?.userInstagramId}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>ID da Loja: {instagramConfig.instagramConfig?.storeId}</span>
                            </div>
                        </WhiteCard>
                    ) }
                </div>
            </div>
        </div>
    );
}