import { redirect } from "next/navigation";
import ProductsView from "@/frontend/components/ProductsView/productsview.view";
import DeleteSuccessToastView from "@/frontend/components/DeleteSuccessToast/deletesuccesstoast.view";
import { ProductsController } from "@/backend/controllers/products.controller";
import { getStoreIdAction } from "./getstoreid.action";

const INITIAL_PAGE = 1;
const INITIAL_LIMIT = 5;

export default async function ProductsPage() {
    const result = await getStoreIdAction();
    const { success, data } = result;

    if (!success || !data) redirect("/dashboard");

    const listResult = await ProductsController.listProducts({
        storeId: data.storeId,
        page: INITIAL_PAGE,
        limit: INITIAL_LIMIT,
    });

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] animate-in fade-in duration-700">
            <DeleteSuccessToastView />
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Lista de Produtos</h2>
                <p className="text-gray-500">Gerencie seu inventário e crie conteúdos promocionais.</p>
            </header>
            <div className="w-full h-auto">
                <ProductsView
                    storeId={data.storeId}
                    initialProducts={listResult.data}
                    initialPagination={listResult.pagination}
                />
            </div>
        </div>
    )
}