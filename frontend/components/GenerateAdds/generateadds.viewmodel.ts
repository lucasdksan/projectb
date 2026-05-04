"use client";

import { useTransition, useState, useRef, useEffect } from "react";
import { generateAddsAction } from "@/app/(private)/dashboard/products/[slug]/generateadds.action";
import type { GenerateAddsResult, GenerateAddsResponse } from "@/backend/schemas/generateadds.schema";
import type { GenerateAddsModel } from "./generateadds.model";

function isStructuredResult(result: GenerateAddsResult): result is GenerateAddsResponse {
    return "headline" in result && typeof result.headline === "string";
}

export function useGenerateAddsViewModel(model: GenerateAddsModel) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [result, setResult] = useState<GenerateAddsResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            // eslint-disable-next-line react-hooks/set-state-in-effect -- object URL lifecycle; cleanup revokes URL
            setFilePreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        setFilePreviewUrl(null);
    }, [selectedFile]);

    const displayImage = selectedImageUrl ?? filePreviewUrl;

    const openModal = () => {
        setIsOpen(true);
        setResult(null);
        setError(null);
        setSelectedImageUrl(null);
        setSelectedFile(null);
    };

    const closeModal = () => {
        setIsOpen(false);
        setResult(null);
        setError(null);
        setSelectedImageUrl(null);
        setSelectedFile(null);
    };

    const selectProductImage = (url: string) => {
        setSelectedImageUrl(url);
        setSelectedFile(null);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setSelectedImageUrl(null);
        }
    };

    const clearImage = () => {
        setSelectedImageUrl(null);
        setSelectedFile(null);
    };

    const hasImage = !!selectedImageUrl || !!selectedFile;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setResult(null);

        const fd = new FormData();
        fd.set("name", model.name);
        fd.set("description", model.description || "");
        fd.set("price", String(model.price));
        fd.set("stock", String(model.stock));

        if (selectedFile) {
            fd.set("image", selectedFile);
        } else if (selectedImageUrl) {
            fd.set("imageUrl", selectedImageUrl);
        }

        startTransition(async () => {
            const res = await generateAddsAction(null, fd);
            if (res.success) {
                setResult(res.data);
            } else {
                setError(res.errors?.global?.[0] ?? res.errors?.image?.[0] ?? "Erro ao gerar anúncio.");
            }
        });
    };

    const handleCopyResult = () => {
        if (!result || !isStructuredResult(result)) return;
        const text = `${result.headline}\n\n${result.description}\n\n${result.cta}\n\n${result.hashtags}`;
        void navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return {
        isOpen,
        openModal,
        closeModal,
        selectedImageUrl,
        selectedFile,
        selectProductImage,
        handleFileSelect,
        clearImage,
        hasImage,
        result,
        error,
        isLoading: isPending,
        handleSubmit,
        displayImage,
        handleCopyResult,
        fileInputRef,
        copied,
        isStructuredResult,
    };
}
