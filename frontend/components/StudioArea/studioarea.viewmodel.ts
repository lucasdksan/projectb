"use client";

import { generateContentAction } from "@/app/(private)/dashboard/postStudio/generatecontent.action";
import { useActionState, useState, useCallback, useEffect, useMemo } from "react";
import { initialState, type StudioAreaState } from "./studioarea.model";

export function useStudioAreaViewModel() {
    const [state, formAction, isPending] = useActionState(generateContentAction, initialState);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const normalizedState = useMemo<StudioAreaState>(
        () => ({
            success: state.success,
            errors: state.success ? {} : (state.errors ?? {}),
            data: state.success && "data" in state ? state.data : "",
        }),
        [state],
    );

    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedImage((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(file);
        });
    }, []);

    const downloadImage = useCallback(() => {
        if (!normalizedState.data) return;
        const isDataOrBlob = normalizedState.data.startsWith("data:") || normalizedState.data.startsWith("blob:");
        if (isDataOrBlob) {
            const a = document.createElement("a");
            a.href = normalizedState.data;
            a.download = "post-gerado.png";
            a.click();
            return;
        }
        fetch(normalizedState.data)
            .then((res) => res.blob())
            .then((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "post-gerado.png";
                a.click();
                URL.revokeObjectURL(url);
            })
            .catch(() => { });
    }, [normalizedState.data]);

    const openFileDialog = useCallback((input: HTMLInputElement | null) => {
        input?.click();
    }, []);

    useEffect(() => {
        return () => {
            if (selectedImage) URL.revokeObjectURL(selectedImage);
        };
    }, [selectedImage]);
    return {
        state: normalizedState,
        formAction,
        isPending,
        selectedImage,
        handleImageChange,
        downloadImage,
        openFileDialog,
    };
}