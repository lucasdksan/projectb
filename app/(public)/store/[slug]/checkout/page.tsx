import { redirect } from "next/navigation";
import { getStoreBySlugAction } from "../getstorebyslug.action";
import CheckoutPageView from "@/frontend/components/CheckoutPage/checkoutpage.view";

export default async function CheckoutPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const storeResult = await getStoreBySlugAction(slug);

    if (!storeResult.success || !storeResult.data) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <p>Loja não encontrada</p>
            </div>
        );
    }

    const { store } = storeResult.data;

    return (
        <CheckoutPageView
            storeSlug={slug}
            storeName={store.name}
            primaryColor={store.config?.primaryColor ?? "#b8860b"}
            secondaryColor={store.config?.secondaryColor ?? "#1a1a1a"}
        />
    );
}
