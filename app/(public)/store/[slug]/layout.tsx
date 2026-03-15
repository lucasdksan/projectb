import { getStoreBySlugAction } from "./getstorebyslug.action";
import StoreCartView from "@/frontend/contexts/storeCart/storecart.view";
import StoreHeaderView from "@/frontend/components/StoreHeader/storeheader.view";
import StoreFooterView from "@/frontend/components/StoreFooter/storefooter.view";

export default async function StoreSlugLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const storeResult = await getStoreBySlugAction(slug);

    if (!storeResult.success || !storeResult.data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loja não encontrada</p>
            </div>
        );
    }

    const { store } = storeResult.data;

    return (
        <StoreCartView storeSlug={slug}>
            <div className="min-h-screen flex flex-col bg-white">
                <StoreHeaderView
                    storeSlug={slug}
                    storeName={store.name}
                    logoUrl={store.config?.logoUrl ?? ""}
                    primaryColor={store.config?.primaryColor ?? "#b8860b"}
                    secondaryColor={store.config?.secondaryColor ?? "#1a1a1a"}
                />
                <main className="flex-1">{children}</main>
                <StoreFooterView
                    storeName={store.name}
                    logoUrl={store.config?.logoUrl ?? ""}
                />
            </div>
        </StoreCartView>
    );
}
