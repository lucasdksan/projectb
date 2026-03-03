export interface ProductImage {
    url: string;
}

export interface EditProductModel {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    images: ProductImage[];
    isActive: boolean;
}

export interface EditProductFormState {
    name: string;
    description: string;
    price: string;
    stock: string;
    image: File | null;
    isActive: boolean;
}
