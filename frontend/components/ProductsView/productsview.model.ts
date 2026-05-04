import { formatCurrencyFromCents } from "@/libs/format-currency";

export interface ProductModel {
    id: number;
    name: string;
    price: number;
    stock: number;
    createdAt: string | Date;
    images?: { url: string }[];
}

export interface ProductViewData {
    id: number;
    name: string;
    priceFormatted: string;
    stockLabel: string;
    stockPercentage: number;
    createdAtFormatted: string;
    imageUrl?: string;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ProductsViewProps {
    storeId: number;
    initialProducts?: ProductModel[];
    initialPagination?: PaginationInfo;
}

export interface ProductsState {
    products: ProductViewData[];
    pagination: PaginationInfo;
    isLoading: boolean;
}

/** Accepts dashboard ProductModel or full Prisma-shaped rows from list products. */
export function mapProductToViewData(product: {
    id: number;
    name: string;
    price: number;
    stock: number;
    createdAt: string | Date;
    images?: readonly { url: string }[] | null;
}): ProductViewData {
    return {
        id: product.id,
        name: product.name,
        priceFormatted: formatCurrencyFromCents(product.price),
        stockLabel: `${product.stock} un.`,
        stockPercentage: Math.min(product.stock, 100),
        createdAtFormatted: new Date(product.createdAt)
            .toLocaleDateString("pt-BR"),
        imageUrl: product.images?.[0]?.url,
    };
}