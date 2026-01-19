import { redirect } from "next/navigation";
import { getCurrentUser } from "@/libs/auth";
import { getProductAction, getStoreByUserIdAction } from "./action";
import ProductCard from "@/frontend/components/ProductCard";
import GenerateContentAI from "@/frontend/components/GenerateContentAI";

interface DashboardProductDetailProps {
    params: Promise<{ slug: string }>;
}   

export default async function DashboardProductDetail(props: DashboardProductDetailProps) {
    const { slug } = await props.params;

    const user = await getCurrentUser();

    if (!user) redirect("/login");

    const { store, success } = await getStoreByUserIdAction(String(user.sub));

    if(!success || !store) redirect("/dashboard/store");

    const { product, success: productSuccess } = await getProductAction(Number(slug));

    if(!productSuccess || !product) redirect("/dashboard/product/list");

    return (
        <div className="w-full h-full p-6 flex flex-col gap-3">
            <div className="flex flex-col md:items-start justify-between">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Detalhes do Produto</h2>
                <p className="text-slate-500 mt-1">Visualize as informações do produto.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-3">
                <ProductCard product={product} />
                <GenerateContentAI />
            </div>
        </div>
    );
}