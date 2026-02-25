import { z } from "zod";

export const addProductModel = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().optional(),
    price: z.coerce.number().min(0.01, "Preço deve ser maior que zero"),
    stock: z.coerce.number().int().min(0, "Estoque deve ser zero ou maior"),
});

export type AddProductModelType = z.infer<typeof addProductModel>;

export type AddProductFormState = {
    name: string;
    description: string;
    price: string;
    stock: string;
    image: File | null;
};

export const defaultAddProductForm: AddProductFormState = {
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
};

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ACCEPTED_IMAGE_EXT = ".jpg,.jpeg,.png,.webp";