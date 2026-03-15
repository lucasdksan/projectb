"use client";

import { useCheckoutPageViewModel } from "./checkoutpage.viewmodel";
import type { CheckoutPageViewProps } from "./checkoutpage.model";

export default function CheckoutPageView(props: CheckoutPageViewProps) {
    const {
        items,
        subtotal,
        form,
        updateFormField,
        handleSubmit,
        isSubmitDisabled,
        submitButtonText,
        errors,
    } = useCheckoutPageViewModel(props);

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-8">
                <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>

                {errors.global && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm">
                        {errors.global.join(", ")}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm"
                                style={{ backgroundColor: props.secondaryColor }}
                            >
                                1
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">
                                Informações de Entrega
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Nome completo"
                                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gray-300 placeholder:text-gray-600 text-gray-900"
                                value={form.fullName}
                                onChange={(e) => updateFormField("fullName", e.target.value)}
                                required
                            />
                            <input
                                type="email"
                                placeholder="E-mail"
                                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gray-300 placeholder:text-gray-600 text-gray-900"
                                value={form.email}
                                onChange={(e) => updateFormField("email", e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="CEP"
                                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gray-300 placeholder:text-gray-600 text-gray-900"
                                value={form.cep}
                                onChange={(e) => updateFormField("cep", e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Cidade"
                                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gray-300 placeholder:text-gray-600 text-gray-900"
                                value={form.city}
                                onChange={(e) => updateFormField("city", e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Endereço"
                                className="md:col-span-2 w-full p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gray-300 placeholder:text-gray-600 text-gray-900"
                                value={form.address}
                                onChange={(e) => updateFormField("address", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm"
                                style={{ backgroundColor: props.secondaryColor }}
                            >
                                2
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">Pagamento</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div
                                className="p-4 rounded-xl border-2 flex items-center justify-between"
                                style={{
                                    borderColor: props.secondaryColor,
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full border-4"
                                        style={{
                                            borderColor: props.secondaryColor,
                                        }}
                                    />
                                    <span className="font-bold">
                                        Cartão de Crédito
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-8 h-5 bg-gray-200 rounded" />
                                    <div className="w-8 h-5 bg-gray-200 rounded" />
                                </div>
                            </div>
                            <div className="p-4 rounded-xl border border-gray-100 flex items-center gap-3 text-gray-600 cursor-not-allowed">
                                <div className="w-4 h-4 rounded-full border border-gray-300" />
                                <span className="font-medium">
                                    Pix (Em breve)
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className="w-full py-4 rounded-full font-bold uppercase tracking-widest text-white shadow-xl transition-all hover:shadow-2xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: props.primaryColor }}
                    >
                        {submitButtonText}
                    </button>
                </form>
            </div>

            <div className="lg:col-span-5">
                <div className="sticky top-24 bg-gray-50 rounded-3xl p-8 space-y-6">
                    <h3 className="font-bold text-xl text-gray-900">Resumo do Pedido</h3>
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {items.map((item) => (
                            <div
                                key={item.productId}
                                className="flex justify-between items-center text-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className="font-bold text-gray-800"
                                        style={{
                                            color: props.secondaryColor,
                                        }}
                                    >
                                        {item.quantity}x
                                    </span>
                                    <span className="font-medium text-gray-700 line-clamp-1">
                                        {item.name}
                                    </span>
                                </div>
                                <span className="font-bold text-gray-900">
                                    R${" "}
                                    {(item.price * item.quantity).toLocaleString(
                                        "pt-BR",
                                        { minimumFractionDigits: 2 }
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-200 pt-6 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-700">Subtotal</span>
                            <span className="text-gray-900">
                                R${" "}
                                {subtotal.toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2,
                                })}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-700">Frete</span>
                            <span className="text-green-600 font-medium">
                                Grátis
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                            <span className="text-lg font-bold text-gray-900">Total</span>
                            <span
                                className="text-2xl font-black"
                                style={{ color: props.secondaryColor }}
                            >
                                R${" "}
                                {subtotal.toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2,
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
