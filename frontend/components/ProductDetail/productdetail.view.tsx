"use client";

import Link from "next/link";
import { ChevronLeft, ShoppingBasket } from "lucide-react";
import { useProductDetailViewModel } from "./productdetail.viewmodel";
import type { ProductDetailModel } from "./productdetail.model";

type ProductDetailViewProps = ProductDetailModel;

export default function ProductDetailView(props: ProductDetailViewProps) {
    const { handleAddToCart, handleAddAndStay, priceFormatted } =
        useProductDetailViewModel(props);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
            <Link
                href={`/store/${props.storeSlug}`}
                className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8"
            >
                <ChevronLeft size={20} />
                <span>Voltar para a Home</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100">
                    {props.imageUrl ? (
                        <img
                            src={props.imageUrl}
                            alt={props.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Sem imagem
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                            {props.name}
                        </h1>
                        <p
                            className="text-2xl font-black"
                            style={{ color: props.primaryColor }}
                        >
                            {priceFormatted}
                        </p>
                    </div>

                    {props.description && (
                        <div className="prose prose-sm text-gray-600">
                            <p>{props.description}</p>
                        </div>
                    )}

                    <div className="space-y-4 pt-4">
                        <button
                            type="button"
                            className="w-full py-4 rounded-full font-bold uppercase tracking-widest text-white shadow-xl transition-all hover:shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                            style={{ backgroundColor: props.primaryColor }}
                            onClick={handleAddToCart}
                        >
                            <ShoppingBasket size={20} />
                            Adicionar à Sacola
                        </button>
                        <button
                            type="button"
                            className="w-full py-3 rounded-full font-medium border-2 transition-colors hover:bg-gray-50"
                            style={{
                                borderColor: props.primaryColor,
                                color: props.primaryColor,
                            }}
                            onClick={handleAddAndStay}
                        >
                            Adicionar e Continuar Comprando
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
