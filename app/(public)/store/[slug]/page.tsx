import {
    ShoppingBag,
    Search,
    ChevronLeft,
    X,
    Plus,
    Minus,
    ArrowRight,
    CheckCircle2,
    Menu,
    ShoppingBasket
} from "lucide-react";
import StoreProductsGridView from "@/frontend/components/StoreProductsGrid/storeproductsgrid.view";
import { getStoreBySlugAction } from "./getstorebyslug.action";
import { getProductsByStoreSlugAction } from "./getproductsbystoreslug.action";
import Link from "next/link";

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
        <>
            <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full">
                            <Menu size={20} />
                        </button>
                        <Link
                            className="flex items-center gap-2 cursor-pointer"
                            href={`/store/${slug}`}
                        >
                            <img
                                src={data.store.config?.logoUrl ?? ""}
                                alt={data.store.name}
                                className="w-8 h-8 rounded-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                            <span className="font-bold text-xl tracking-tight hidden sm:block" style={{ color: data.store.config?.secondaryColor }}>
                                {data.store.name}
                            </span>
                        </Link>
                    </div>

                    {/* <div className="flex-1 max-w-md relative">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Buscar produtos..."
                                className="w-full bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-opacity-50 transition-all outline-none"
                                style={{ '--tw-ring-color': storeConfig.primaryColor } as any}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div> */}

                    <div className="flex items-center gap-2">
                        <button
                            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                        // onClick={() => setCurrentPage('cart')}
                        >
                            <ShoppingBag size={24} style={{ color: data.store.config?.secondaryColor }} />
                            {/* {cartCount > 0 && (
                                <span
                                    className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white rounded-full border-2 border-white"
                                    style={{ backgroundColor: storeConfig.primaryColor }}
                                >
                                    {cartCount}
                                </span>
                            )} */}
                        </button>
                    </div>
                </div>
            </header>
            <main className="space-y-12 pb-20 bg-white">
                <section className="relative w-full aspect-[21/9] min-h-[200px] overflow-hidden bg-gray-100">
                    <img
                        src={data.store.config?.bannerHeroURL ?? ""}
                        alt="Hero"
                        className="w-full h-full object-cover object-top"
                        referrerPolicy="no-referrer"
                    />
                </section>
                <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="w-full min-h-screen flex flex-col items-center bg-white">
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
            </main>
            <footer>
                <h1>Footer</h1>
            </footer>
        </>
    );
}