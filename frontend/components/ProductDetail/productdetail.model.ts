export interface ProductDetailModel {
    productId: number;
    slug: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    storeSlug: string;
    primaryColor: string;
}
