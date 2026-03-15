export type CartItem = {
    productId: number;
    slug: string;
    name: string;
    price: number;
    imageUrl: string | null;
    quantity: number;
};

export type StoreCartState = {
    items: CartItem[];
    itemCount: number;
    subtotal: number;
};

export type StoreCartContextProps = StoreCartState & {
    addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
};

export const STORE_CART_STORAGE_KEY_PREFIX = "store-cart-";
