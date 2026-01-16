import { redirect } from "next/navigation";
import FormCreateProduct from "@/frontend/components/FormCreateProduct";
import { getCurrentUser } from "@/libs/auth";
import { searchStoreAction } from "./action";

export default async function DashboardCreateProduct(){
    const user = await getCurrentUser();

    if (!user) redirect("/login");

    const { store, success } = await searchStoreAction(String(user.sub));

    if(!success || !store) redirect("/dashboard/store");

    return(
        <div className="w-full h-full p-6 flex flex-col gap-3">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Novo Produto</h2>
                <p className="text-slate-500 mt-1 lg:hidden">Preencha as informações para cadastrar e gerar conteúdo.</p>
            </div>
            <FormCreateProduct storeId={store.id}/>
        </div>
    );
}