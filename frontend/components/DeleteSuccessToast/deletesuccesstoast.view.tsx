"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/frontend/hooks/useToast";

export default function DeleteSuccessToastView() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { showToast } = useToast() ?? {};

    useEffect(() => {
        if (searchParams.get("deleted") === "1" && showToast) {
            showToast({
                type: "success",
                message: "Produto deletado com sucesso!",
            });
            router.replace("/dashboard/products");
        }
    }, [searchParams, router, showToast]);

    return null;
}
