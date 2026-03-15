"use client";

import { ShoppingBag, X, Plus, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCartPageViewModel } from "./cartpage.viewmodel";
import type { CartPageViewProps } from "./cartpage.model";

export default function CartPageView(props: CartPageViewProps) {
    const {
        items,
        itemCount,
        subtotal,
        removeItem,
        handleQuantityChange,
        handleCheckout,
        handleBackToStore,
    } = useCartPageViewModel(props);

    return (
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Sua Sacola</h1>
                <span className="text-gray-500">{itemCount} itens</span>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-20 space-y-6">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                        <ShoppingBag size={40} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold">Sua sacola está vazia</h2>
                        <p className="text-gray-500">
                            Que tal dar uma olhada nas nossas novidades?
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleBackToStore}
                        className="px-8 py-3 rounded-full font-bold text-white uppercase tracking-widest text-sm"
                        style={{ backgroundColor: props.primaryColor }}
                    >
                        Voltar para a Loja
                    </button>
                </div>
            ) : (
                <>
                    <div className="space-y-6">
                        {items.map((item) => (
                            <div
                                key={item.productId}
                                className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
                            >
                                <div className="w-24 h-32 rounded-xl overflow-hidden shrink-0">
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                                            Sem imagem
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div className="flex justify-between items-start">
                                        <Link
                                            href={`/store/${props.storeSlug}/product/${item.slug}`}
                                            className="hover:underline"
                                        >
                                            <h3 className="font-bold text-gray-900">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.productId)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1 border border-gray-300">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.productId,
                                                        -1
                                                    )
                                                }
                                                className="p-1 text-gray-800 hover:text-black transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-sm font-bold w-4 text-center text-gray-900">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.productId,
                                                        1
                                                    )
                                                }
                                                className="p-1 text-gray-800 hover:text-black transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <p
                                            className="font-bold"
                                            style={{ color: props.primaryColor }}
                                        >
                                            R${" "}
                                            {(item.price * item.quantity).toLocaleString(
                                                "pt-BR",
                                                { minimumFractionDigits: 2 }
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-50 rounded-3xl p-8 space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Subtotal</span>
                                <span className="text-gray-700">
                                    R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Frete</span>
                                <span className="text-green-600 font-medium">
                                    Grátis
                                </span>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span
                                    className="text-2xl font-black"
                                    style={{ color: props.secondaryColor }}
                                >
                                    R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="w-full py-4 rounded-full font-bold uppercase tracking-widest text-white shadow-xl transition-all hover:shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                            style={{ backgroundColor: props.primaryColor }}
                            onClick={handleCheckout}
                        >
                            Finalizar Compra
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
