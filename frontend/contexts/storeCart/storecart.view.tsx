"use client";

import { StoreCartContext } from "./storecart.viewmodel";
import useStoreCartViewModel from "./storecart.viewmodel";

interface StoreCartViewProps {
    storeSlug: string;
    children: React.ReactNode;
}

export default function StoreCartView({ storeSlug, children }: StoreCartViewProps) {
    const { value } = useStoreCartViewModel(storeSlug);

    return (
        <StoreCartContext.Provider value={value}>
            {children}
        </StoreCartContext.Provider>
    );
}
