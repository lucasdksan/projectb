"use client";

import { ShoppingCart, DollarSign } from "lucide-react";
import { useSalesCardsViewModel } from "./salescards.viewmodel";
import type { SalesCardsProps } from "./salescards.model";

export default function SalesCardsView(props: SalesCardsProps) {
    const { orderCount, formattedRevenue } = useSalesCardsViewModel(props);

    return (
        <>
            <div className="bg-[#161616] border border-white/5 p-6 rounded-2xl hover:border-[#00ff41]/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-xl group-hover:text-[#00ff41] transition-colors">
                        <ShoppingCart size={24} />
                    </div>
                    <span className="text-xs font-bold text-[#00ff41] bg-[#00ff41]/10 px-2 py-1 rounded-full">
                        Pedidos
                    </span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">Vendas Realizadas</h3>
                <p className="text-2xl font-bold text-white">{orderCount}</p>
            </div>
            <div className="bg-[#161616] border border-white/5 p-6 rounded-2xl hover:border-[#00ff41]/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-xl group-hover:text-[#00ff41] transition-colors">
                        <DollarSign size={24} />
                    </div>
                    <span className="text-xs font-bold text-[#00ff41] bg-[#00ff41]/10 px-2 py-1 rounded-full">
                        Faturamento
                    </span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">Faturamento Total</h3>
                <p className="text-2xl font-bold text-white">{formattedRevenue}</p>
            </div>
        </>
    );
}
