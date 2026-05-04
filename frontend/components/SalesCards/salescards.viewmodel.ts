import { formatCurrencyFromCents } from "@/libs/format-currency";
import { SalesCardsProps } from "./salescards.model";

export function useSalesCardsViewModel({ orderCount, totalRevenue }: SalesCardsProps) {
    const formattedRevenue = formatCurrencyFromCents(totalRevenue ?? 0);

    return {
        orderCount,
        formattedRevenue,
    };
}
