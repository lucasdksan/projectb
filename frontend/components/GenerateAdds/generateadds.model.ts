import type { GenerateAddsResult } from "@/backend/schemas/generateadds.schema";

export interface ProductImage {
    url: string;
}

export interface GenerateAddsModel {
    name: string;
    description: string;
    price: number;
    stock: number;
    productImages?: ProductImage[];
}

export interface GenerateAddsViewModelState {
    isOpen: boolean;
    selectedImageUrl: string | null;
    selectedFile: File | null;
    isLoading: boolean;
    result: GenerateAddsResult | null;
    error: string | null;
}