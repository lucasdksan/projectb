"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useStoreCart } from "@/frontend/contexts/storeCart/storecart.viewmodel";
import type { CardProductModel } from "./cardproduct.model";
import { formatCardProductDisplay } from "./cardproduct.viewmodel";

type CardProductViewProps = CardProductModel;

export default function CardProductView(props: CardProductViewProps) {
    const display = formatCardProductDisplay(props);
    const { addItem } = useStoreCart();
    const accentColor = props.primaryColor ?? "#b8860b";

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(
            {
                productId: props.id,
                slug: props.slug,
                name: props.name,
                price: props.price,
                imageUrl: display.imageUrl,
            },
            1
        );
    };

    return (
        <div className="group block w-full bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={display.productUrl} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    {display.imageUrl ? (
                        <img
                            src={display.imageUrl}
                            alt={display.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-sm">
                            Sem imagem
                        </div>
                    )}
                    <button
                        type="button"
                        className="absolute bottom-4 right-4 p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-white"
                        style={{ backgroundColor: accentColor }}
                        onClick={handleAddToCart}
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <div className="p-3 space-y-1">
                    <h3 className="text-sm text-gray-800 line-clamp-2 font-medium">
                        {display.name}
                    </h3>
                    <p className="text-base font-bold" style={{ color: accentColor }}>
                        {display.priceFormatted}
                    </p>
                </div>
            </Link>
        </div>
    );
}
