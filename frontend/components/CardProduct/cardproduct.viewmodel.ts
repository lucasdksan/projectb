import type { CardProductDisplay, CardProductModel } from "./cardproduct.model";

export function formatCardProductDisplay(model: CardProductModel): CardProductDisplay {
    const priceFormatted = `R$ ${Number(model.price).toFixed(2).replace(".", ",")}`;
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
