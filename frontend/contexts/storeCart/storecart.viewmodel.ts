"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, StoreCartContextProps } from "./storecart.model";
import { STORE_CART_STORAGE_KEY_PREFIX } from "./storecart.model";

export const StoreCartContext = createContext<StoreCartContextProps | null>(null);

export function useStoreCart() {
    const ctx = useContext(StoreCartContext);
    if (!ctx) {
        throw new Error("useStoreCart must be used within StoreCartProvider");
    }
    return ctx;
}

function getStorageKey(storeSlug: string) {
    return `${STORE_CART_STORAGE_KEY_PREFIX}${storeSlug}`;
}

function loadFromStorage(storeSlug: string): CartItem[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(getStorageKey(storeSlug));
        if (!raw) return [];
        const parsed = JSON.parse(raw) as CartItem[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveToStorage(storeSlug: string, items: CartItem[]) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(getStorageKey(storeSlug), JSON.stringify(items));
    } catch {
        // ignore
    }
}

export default function useStoreCartViewModel(storeSlug: string) {
    const [items, setItems] = useState<CartItem[]>(() =>
        typeof window === "undefined" ? [] : loadFromStorage(storeSlug)
    );

    useEffect(() => {
        setItems(loadFromStorage(storeSlug));
    }, [storeSlug]);

    const persist = useCallback(
        (nextItems: CartItem[]) => {
            saveToStorage(storeSlug, nextItems);
        },
        [storeSlug]
    );

    const addItem = useCallback(
        (item: Omit<CartItem, "quantity">, quantity = 1) => {
            setItems((prev) => {
                const existing = prev.find((i) => i.productId === item.productId);
                const next =
                    existing
                        ? prev.map((i) =>
                              i.productId === item.productId
                                  ? { ...i, quantity: i.quantity + quantity }
                                  : i
                          )
                        : [...prev, { ...item, quantity }];
                persist(next);
                return next;
            });
        },
        [persist]
    );

    const removeItem = useCallback(
        (productId: number) => {
            setItems((prev) => {
                const next = prev.filter((i) => i.productId !== productId);
                persist(next);
                return next;
            });
        },
        [persist]
    );

    const updateQuantity = useCallback(
        (productId: number, quantity: number) => {
            setItems((prev) => {
                const next =
                    quantity <= 0
                        ? prev.filter((i) => i.productId !== productId)
                        : prev.map((i) =>
                              i.productId === productId ? { ...i, quantity } : i
                          );
                persist(next);
                return next;
            });
        },
        [persist]
    );

    const clearCart = useCallback(() => {
        setItems([]);
        persist([]);
    }, [persist]);

    const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
    const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

    const value = useMemo<StoreCartContextProps>(
        () => ({
            items,
            itemCount,
            subtotal,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
        }),
        [items, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart]
    );

    return { value };
}
