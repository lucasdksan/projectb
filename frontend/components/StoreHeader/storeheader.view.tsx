"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useStoreHeaderViewModel } from "./storeheader.viewmodel";
import ProductSearchView from "@/frontend/components/ProductSearch/productsearch.view";
import { useStoreCart } from "@/frontend/contexts/storeCart/storecart.viewmodel";
import type { StoreHeaderViewProps } from "./storeheader.model";

export default function StoreHeaderView(props: StoreHeaderViewProps) {
    const { storeSlug, storeName, logoUrl, primaryColor, secondaryColor } =
        useStoreHeaderViewModel(props);
    const { itemCount } = useStoreCart();

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        className="flex items-center gap-2 cursor-pointer"
                        href={`/store/${storeSlug}`}
                    >
                        <img
                            src={logoUrl}
                            alt={storeName}
                            className="w-8 h-8 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                        <span
                            className="font-bold text-xl tracking-tight hidden sm:block"
                            style={{ color: secondaryColor }}
                        >
                            {storeName}
                        </span>
                    </Link>
                </div>

                <div className="flex-1 min-w-0 max-w-md mx-2 sm:mx-4">
                    <ProductSearchView
                        storeSlug={storeSlug}
                        primaryColor={primaryColor}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href={`/store/${storeSlug}/cart`}
                        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ShoppingBag size={24} style={{ color: secondaryColor }} />
                        {itemCount > 0 && (
                            <span
                                className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white rounded-full border-2 border-white"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {itemCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}
