"use client";

import { useRouter } from "next/navigation";
import { useStoreCart } from "@/frontend/contexts/storeCart/storecart.viewmodel";
import type { ProductDetailModel } from "./productdetail.model";

export function useProductDetailViewModel(model: ProductDetailModel) {
    const { addItem } = useStoreCart();
    const router = useRouter();

    const handleAddToCart = () => {
        addItem(
            {
                productId: model.productId,
                slug: model.slug,
                name: model.name,
                price: model.price,
                imageUrl: model.imageUrl,
            },
            1
        );
        router.push(`/store/${model.storeSlug}/cart`);
    };

    const handleAddAndStay = () => {
        addItem(
            {
                productId: model.productId,
                slug: model.slug,
                name: model.name,
                price: model.price,
                imageUrl: model.imageUrl,
            },
            1
        );
    };

    return {
        handleAddToCart,
        handleAddAndStay,
        priceFormatted: `R$ ${Number(model.price).toFixed(2).replace(".", ",")}`,
    };
}
