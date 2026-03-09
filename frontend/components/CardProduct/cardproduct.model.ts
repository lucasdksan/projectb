export interface CardProductModel {
    id: number;
    name: string;
    price: number;
    images: { url: string }[];
    slug: string;
    storeSlug?: string;
}

export interface CardProductDisplay {
    name: string;
    priceFormatted: string;
    imageUrl: string | null;
    productUrl: string;
}
