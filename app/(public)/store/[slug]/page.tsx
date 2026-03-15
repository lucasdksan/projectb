import StoreProductsGridView from "@/frontend/components/StoreProductsGrid/storeproductsgrid.view";
import { getStoreBySlugAction } from "./getstorebyslug.action";
import { getProductsByStoreSlugAction } from "./getproductsbystoreslug.action";

export default async function StorePage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ q?: string }>;
}) {
    const { slug } = await params;
    const { q: searchQuery } = await searchParams;

    const [storeResult, productsResult] = await Promise.all([
        getStoreBySlugAction(slug),
        getProductsByStoreSlugAction(slug, 1, 5, searchQuery),
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
            : { page: 1, limit: 5, total: 0, totalPages: 0 };

    return (
        <>
            <section className="relative w-full overflow-hidden bg-gray-100">
                <img
                    src={data.store.config?.bannerHeroMobileURL ?? data.store.config?.bannerHeroURL ?? ""}
                    alt="Hero"
                    className="md:hidden w-full h-auto block"
                    referrerPolicy="no-referrer"
                />
                <img
                    src={data.store.config?.bannerHeroURL ?? ""}
                    alt="Hero"
                    className="hidden md:block w-full h-auto block"
                    referrerPolicy="no-referrer"
                />
            </section>
            <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 py-12">
                <div className="relative h-64 overflow-hidden group cursor-pointer rounded-2xl">
                    <img
                        src={data.store.config?.bannerSecondaryURL ?? ""}
                        alt="Secondary"
                        className="w-full h-full object-cover object-top"
                        referrerPolicy="no-referrer"
                    />
                </div>
                <div className="relative h-64 overflow-hidden group cursor-pointer rounded-2xl">
                    <img
                        src={data.store.config?.bannerTertiaryURL ?? ""}
                        alt="Secondary"
                        className="w-full h-full object-cover object-top"
                        referrerPolicy="no-referrer"
                    />
                </div>
            </section>
            <div className="w-full min-h-screen flex flex-col items-center pb-20">
                <div className="w-full px-4 py-6 max-w-6xl">
                    <h2
                        className="text-lg font-semibold text-gray-800 mb-4"
                        style={{ color: data.store.config?.secondaryColor }}
                    >
                        Produtos em Destaque
                    </h2>
                    <StoreProductsGridView
                        storeSlug={slug}
                        initialProducts={initialProducts}
                        initialPagination={initialPagination}
                        initialSearch={searchQuery}
                        primaryColor={data.store.config?.primaryColor}
                    />
                </div>
            </div>
        </>
    );
}
