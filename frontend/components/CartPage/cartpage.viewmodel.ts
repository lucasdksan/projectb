"use client";

import { useRouter } from "next/navigation";
import { useStoreCart } from "@/frontend/contexts/storeCart/storecart.viewmodel";
import type { CartPageModel } from "./cartpage.model";

export function useCartPageViewModel(model: CartPageModel) {
    const { items, itemCount, subtotal, removeItem, updateQuantity } =
        useStoreCart();
    const router = useRouter();

    const handleQuantityChange = (productId: number, delta: number) => {
        const item = items.find((i) => i.productId === productId);
        if (!item) return;
        const newQty = Math.max(1, item.quantity + delta);
        updateQuantity(productId, newQty);
    };

    const handleCheckout = () => {
        router.push(`/store/${model.storeSlug}/checkout`);
    };

    const handleBackToStore = () => {
        router.push(`/store/${model.storeSlug}`);
    };

    return {
        items,
        itemCount,
        subtotal,
        removeItem,
        updateQuantity,
        handleQuantityChange,
        handleCheckout,
        handleBackToStore,
    };
}
