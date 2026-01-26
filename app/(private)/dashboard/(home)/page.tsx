import { getCurrentUser } from "@/libs/auth";
import { redirect } from "next/navigation";
import { searchStoreAction } from "../product/create/action";
import { quantityContentAIAction, quantityProductAction } from "./action";
import WhiteCard from "@/frontend/components/WhiteCard";

export default async function DashboardHome() {
    const user = await getCurrentUser();

    if (!user) redirect("/login");

    const { store, success } = await searchStoreAction(String(user.sub));

    if (!success || !store) redirect("/auth/sigin");

    const { success: successContentAIQuantity, quantityContentAI } = await quantityContentAIAction(store.id);

    if(!successContentAIQuantity) redirect("/auth/sigin");

    const { success: successProductQuantity, quantityProduct } = await quantityProductAction(store.id);

    if(!successProductQuantity) redirect("/auth/sigin");

    return (
        <div className="w-full h-full p-6 flex flex-col gap-3">
            <div className="flex flex-col md:items-start justify-between">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Visão Geral</h2>
                <p className="text-slate-500 mt-1">Gerencie seus produtos e acompanhe o desempenho da sua loja.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <WhiteCard>
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary-dark">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>Round-inventory-2 SVG Icon</title><path fill="currentColor" d="M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2m-6 12h-4c-.55 0-1-.45-1-1s.45-1 1-1h4c.55 0 1 .45 1 1s-.45 1-1 1m6-7H4V4h16z"/></svg>
                        </div>
                    </div>
                    <p className="text-text-secondary dark:text-text-secondary-dark text-sm font-medium mb-1">Total de produtos</p>
                    <p className="text-text-main dark:text-text-main-dark text-3xl font-bold">{quantityProduct?.quantityGeral}</p>
                </WhiteCard>
                <WhiteCard>
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>Outline-auto-awesome SVG Icon</title><path fill="currentColor" d="m19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25zm0 6l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25zm-7.5-5.5L9 4L6.5 9.5L1 12l5.5 2.5L9 20l2.5-5.5L17 12zm-1.51 3.49L9 15.17l-.99-2.18L5.83 12l2.18-.99L9 8.83l.99 2.18l2.18.99z"/></svg>
                        </div>
                    </div>
                    <p className="text-text-secondary dark:text-text-secondary-dark text-sm font-medium mb-1">Conteúdos Gerados</p>
                    <p className="text-text-main dark:text-text-main-dark text-3xl font-bold">{quantityContentAI}</p>
                </WhiteCard>
                <WhiteCard>
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>Building-storefront SVG Icon</title><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72L4.318 3.44A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72m-13.5 8.65h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .415.336.75.75.75Z"/></svg>
                        </div>
                    </div>
                    <p className="text-text-secondary dark:text-text-secondary-dark text-sm font-medium mb-1">Novos Produtos</p>
                    <p className="text-text-main dark:text-text-main-dark text-3xl font-bold">{quantityProduct?.quantityLast30Days}</p>
                </WhiteCard>
            </div>
        </div>
    );
}