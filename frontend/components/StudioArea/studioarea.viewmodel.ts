"use client";

import { generateContentAction } from "@/app/(private)/dashboard/postStudio/generatecontent.action";
import { useActionState, useState, useCallback, useEffect } from "react";
import { initialState, type StudioAreaState } from "./studioarea.model";

async function blobUrlToBase64(blobUrl: string): Promise<string> {

    const response = await fetch(blobUrl);
    const blob = await response.blob();

    const arrayBuffer = await blob.arrayBuffer();

    const bytes = new Uint8Array(arrayBuffer);

    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));

    return `data:${blob.type};base64,${btoa(binary)}`;
}

export function useStudioAreaViewModel() {
    const [state, formAction, isPending] = useActionState(generateContentAction, initialState);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [normalizedState, setNormalizedState] = useState<StudioAreaState>({
        success: state.success,
        errors: state.success ? {} : state.errors,
        data: state.success ? state.data : "",
    });

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

    async function generateImage(prompt: string, image: string) {
        const imageBase64 = await blobUrlToBase64(image);
        
        setNormalizedState({
            success: true,
            errors: {},
            data: "",
        });
    }

    useEffect(() => {
        return () => {
            if (selectedImage) URL.revokeObjectURL(selectedImage);
        };
    }, [selectedImage]);


    useEffect(() => {
        if (state.success && state.data && selectedImage) {
            generateImage(state.data, selectedImage);
        }
    }, [state]);
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