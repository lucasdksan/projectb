import { redirect } from "next/navigation";
import { getCurrentUser } from "@/libs/auth";
import { getStoreAction, paginationProductsAction } from "./action";
import ProductList from "@/frontend/components/ProductList";
interface DashboardProductListProps {
    searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function DashboardProductList(props: DashboardProductListProps) {
    const user = await getCurrentUser();
    const searchParams = await props.searchParams;

    if (!user) redirect("/login");

    const { store, success } = await getStoreAction(String(user.sub));

    if (!success || !store) redirect("/dashboard/store");

    const page = Number(searchParams?.page ?? 1);
    const limit = Number(searchParams?.limit ?? 5);

    const { products, success: productsSuccess } = await paginationProductsAction(store.id, page, limit);

    return (
        <div className="w-full h-full p-6 flex flex-col gap-3">
            <div className="flex flex-col md:items-start justify-between">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Lista de produtos</h2>
                <p className="text-slate-500 mt-1">Lista de produtos cadastrados na loja.</p>
            </div>
            {productsSuccess && products && (
                <ProductList
                    products={products.data}
                    total={products.total}
                    page={page}
                    limit={limit}
                />
            )}
        </div>
    );
}