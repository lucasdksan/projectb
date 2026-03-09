import CardStoreView from "@/frontend/components/CardStore/cardstore.view";
import StoreProductsGridView from "@/frontend/components/StoreProductsGrid/storeproductsgrid.view";
import { getStoreBySlugAction } from "./getstorebyslug.action";
import { getProductsByStoreSlugAction } from "./getproductsbystoreslug.action";

export default async function StorePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const [storeResult, productsResult] = await Promise.all([
        getStoreBySlugAction(slug),
        getProductsByStoreSlugAction(slug, 1, 10),
    ]);

    const { success, data } = storeResult;

    if (!success || !data) {
        return (
            <div>
                <h1>Erro ao buscar loja</h1>
            </div>
        );
    }

    const initialProducts =
        productsResult.success && productsResult.data
            ? productsResult.data.products
            : [];
    const initialPagination =
        productsResult.success && productsResult.data
            ? productsResult.data.pagination
            : { page: 1, limit: 10, total: 0, totalPages: 0 };

    return (
        <div className="w-full min-h-screen flex flex-col items-center bg-white">
            <div
                className="w-full h-24"
                style={{ backgroundColor: data.store.config?.primaryColor }}
            />
            <div className="w-full max-w-md flex-1 pt-4 flex justify-center px-4">
                <CardStoreView
                    name={data.store.name}
                    email={data.store.email}
                    number={data.store.number}
                    description={data.store.description}
                    image={data.store.config?.logoUrl ?? ""}
                    primaryColor={data.store.config?.primaryColor}
                    secondaryColor={data.store.config?.secondaryColor}
                />
            </div>
            <div className="w-full px-4 py-6 max-w-6xl">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Produtos
                </h2>
                <StoreProductsGridView
                    storeSlug={slug}
                    initialProducts={initialProducts}
                    initialPagination={initialPagination}
                />
            </div>
        </div>
    );
}