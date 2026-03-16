import { SalesCardsProps } from "./salescards.model";

export function useSalesCardsViewModel({ orderCount, totalRevenue }: SalesCardsProps) {
    const formattedRevenue = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(totalRevenue);

    return {
        orderCount,
        formattedRevenue,
    };
}
