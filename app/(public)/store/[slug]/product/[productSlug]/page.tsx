import { getStoreBySlugAction } from "../../getstorebyslug.action";
import { getProductByStoreSlugAndProductSlugAction } from "./getproductbystoreslug.action";
import ProductDetailView from "@/frontend/components/ProductDetail/productdetail.view";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string; productSlug: string }>;
}) {
    const { slug, productSlug } = await params;

    const [storeResult, productResult] = await Promise.all([
        getStoreBySlugAction(slug),
        getProductByStoreSlugAndProductSlugAction(slug, productSlug),
    ]);

    if (!storeResult.success || !storeResult.data) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <p>Loja não encontrada</p>
            </div>
        );
    }

    if (!productResult.success || !productResult.data) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <p>Produto não encontrado</p>
            </div>
        );
    }

    const { store } = storeResult.data;
    const { product } = productResult.data;

    return (
        <ProductDetailView
            productId={product.id}
            slug={product.slug}
            name={product.name}
            description={product.description}
            price={product.price}
            imageUrl={product.images[0]?.url ?? null}
            storeSlug={slug}
            primaryColor={store.config?.primaryColor ?? "#b8860b"}
        />
    );
}
