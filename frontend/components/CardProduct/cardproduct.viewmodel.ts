import type { CardProductDisplay, CardProductModel } from "./cardproduct.model";
import { formatCurrencyFromCents } from "@/libs/format-currency";

export function formatCardProductDisplay(model: CardProductModel): CardProductDisplay {
    const priceFormatted = formatCurrencyFromCents(model.price);
    const imageUrl = model.images?.[0]?.url ?? null;
    const productUrl = model.storeSlug
        ? `/store/${model.storeSlug}/product/${model.slug}`
        : "#";

    return {
        name: model.name,
        priceFormatted,
        imageUrl,
        productUrl,
    };
}
