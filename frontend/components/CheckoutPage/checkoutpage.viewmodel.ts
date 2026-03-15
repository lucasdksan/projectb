"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStoreCart } from "@/frontend/contexts/storeCart/storecart.viewmodel";
import { createOrderAction } from "@/app/(public)/store/[slug]/checkout/createorder.action";
import type { CheckoutPageModel } from "./checkoutpage.model";

export interface CheckoutFormValues {
    fullName: string;
    email: string;
    cep: string;
    city: string;
    address: string;
}

const INITIAL_FORM: CheckoutFormValues = {
    fullName: "",
    email: "",
    cep: "",
    city: "",
    address: "",
};

export function useCheckoutPageViewModel(model: CheckoutPageModel) {
    const { items, subtotal, clearCart } = useStoreCart();
    const router = useRouter();
    const [form, setForm] = useState<CheckoutFormValues>(INITIAL_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});

    const updateFormField = (field: keyof CheckoutFormValues, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            setErrors({ global: ["Sacola vazia"] });
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        const customer = {
            fullName: form.fullName,
            email: form.email,
            cep: form.cep || undefined,
            city: form.city || undefined,
            address: form.address || undefined,
        };

        const result = await createOrderAction(
            model.storeSlug,
            customer,
            items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
        );

        if (result.success) {
            clearCart();
            router.push(`/store/${model.storeSlug}/order-confirmed`);
        } else {
            setErrors(result.errors ?? {});
        }

        setIsSubmitting(false);
    };

    const isSubmitDisabled = isSubmitting || items.length === 0;
    const submitButtonText = isSubmitting ? "Processando..." : "Confirmar Pagamento";

    return {
        items,
        subtotal,
        form,
        updateFormField,
        handleSubmit,
        isSubmitting,
        isSubmitDisabled,
        submitButtonText,
        errors,
    };
}
