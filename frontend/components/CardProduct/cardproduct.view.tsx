import Link from "next/link";
import { Play } from "lucide-react";
import type { CardProductModel } from "./cardproduct.model";
import { formatCardProductDisplay } from "./cardproduct.viewmodel";

interface CardProductViewProps extends CardProductModel {}

export default function CardProductView(props: CardProductViewProps) {
    const display = formatCardProductDisplay(props);

    return (
        <Link
            href={display.productUrl}
            className="group block w-full bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
            <div className="relative aspect-square overflow-hidden bg-gray-100">
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
                <div className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-black/40 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white" />
                </div>
            </div>

            <div className="p-3 space-y-1">
                <h3 className="text-sm text-gray-800 line-clamp-2 font-medium">
                    {display.name}
                </h3>
                <p className="text-base font-bold" style={{ color: "#ea1d2c" }}>
                    {display.priceFormatted}
                </p>
            </div>
        </Link>
    );
}
