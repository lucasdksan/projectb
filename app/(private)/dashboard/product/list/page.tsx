import { redirect } from "next/navigation";
import { getCurrentUser } from "@/libs/auth";
import { getStoreAction } from "./action";

export default async function DashboardProductList(){
    const user = await getCurrentUser();

    if (!user) redirect("/login");
    
    const { store, success } = await getStoreAction(String(user.sub));

    if(!success || !store) redirect("/dashboard/store");

    return(
        <div className="w-full h-full p-6 flex flex-col gap-3">
            <div className="flex flex-col md:items-start justify-between">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Lista de produtos</h2>
                <p className="text-slate-500 mt-1">Lista de produtos cadastrados na loja.</p>
            </div>
        </div>
    );
}