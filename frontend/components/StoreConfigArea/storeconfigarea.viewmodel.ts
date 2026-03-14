"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { updateStoreConfigAction } from "@/app/(private)/dashboard/storeConfig/updatestoreconfig.action";
import { useToast } from "@/frontend/hooks/useToast";
import type { StoreConfigModel, StoreConfigFormState } from "./storeconfigarea.model";
import { defaultStoreConfigForm, ACCEPTED_IMAGE_TYPES } from "./storeconfigarea.model";

function isObjectUrl(url: string): boolean {
    return url.startsWith("blob:");
}

function formStateFromModel(model: StoreConfigModel | null): StoreConfigFormState {
    if (!model) return defaultStoreConfigForm;
    return {
        primaryColor: model.primaryColor ?? "#000000",
        secondaryColor: model.secondaryColor ?? "#ffffff",
        logo: null,
        bannerHero: null,
        bannerHeroMobile: null,
        bannerSecondary: null,
        bannerTertiary: null,
        bannerHeroClear: false,
        bannerHeroMobileClear: false,
        bannerSecondaryClear: false,
        bannerTertiaryClear: false,
    };
}

function revokeBlobUrls(urls: (string | null)[]) {
    urls.forEach((url) => {
        if (url && isObjectUrl(url)) URL.revokeObjectURL(url);
    });
}

export function useStoreConfigAreaViewModel(model: StoreConfigModel | null) {
    const router = useRouter();
    const toast = useToast();

    const logoInputRef = useRef<HTMLInputElement>(null);
    const bannerHeroInputRef = useRef<HTMLInputElement>(null);
    const bannerHeroMobileInputRef = useRef<HTMLInputElement>(null);
    const bannerSecondaryInputRef = useRef<HTMLInputElement>(null);
    const bannerTertiaryInputRef = useRef<HTMLInputElement>(null);

    const filesRef = useRef<{
        logo: File | null;
        bannerHero: File | null;
        bannerHeroMobile: File | null;
        bannerSecondary: File | null;
        bannerTertiary: File | null;
    }>({
        logo: null,
        bannerHero: null,
        bannerHeroMobile: null,
        bannerSecondary: null,
        bannerTertiary: null,
    });

    const [form, setForm] = useState<StoreConfigFormState>(() => formStateFromModel(model));
    const [logoPreview, setLogoPreview] = useState<string | null>(model?.logoUrl ?? null);
    const [bannerHeroPreview, setBannerHeroPreview] = useState<string | null>(model?.bannerHeroURL ?? null);
    const [bannerHeroMobilePreview, setBannerHeroMobilePreview] = useState<string | null>(model?.bannerHeroMobileURL ?? null);
    const [bannerSecondaryPreview, setBannerSecondaryPreview] = useState<string | null>(model?.bannerSecondaryURL ?? null);
    const [bannerTertiaryPreview, setBannerTertiaryPreview] = useState<string | null>(model?.bannerTertiaryURL ?? null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!model) {
            setForm(defaultStoreConfigForm);
            setLogoPreview(null);
            setBannerHeroPreview(null);
            setBannerHeroMobilePreview(null);
            setBannerSecondaryPreview(null);
            setBannerTertiaryPreview(null);
            return;
        }
        if (!filesRef.current.logo) setLogoPreview(model.logoUrl ?? null);
        if (!filesRef.current.bannerHero) setBannerHeroPreview(model.bannerHeroURL ?? null);
        if (!filesRef.current.bannerHeroMobile) setBannerHeroMobilePreview(model.bannerHeroMobileURL ?? null);
        if (!filesRef.current.bannerSecondary) setBannerSecondaryPreview(model.bannerSecondaryURL ?? null);
        if (!filesRef.current.bannerTertiary) setBannerTertiaryPreview(model.bannerTertiaryURL ?? null);
        setForm((prev) => ({
            ...formStateFromModel(model),
            logo: filesRef.current.logo ?? null,
            bannerHero: filesRef.current.bannerHero ?? null,
            bannerHeroMobile: filesRef.current.bannerHeroMobile ?? null,
            bannerSecondary: filesRef.current.bannerSecondary ?? null,
            bannerTertiary: filesRef.current.bannerTertiary ?? null,
        }));
    }, [model]);

    const previewsRef = useRef<(string | null)[]>([]);
    previewsRef.current = [
        logoPreview,
        bannerHeroPreview,
        bannerHeroMobilePreview,
        bannerSecondaryPreview,
        bannerTertiaryPreview,
    ];
    useEffect(() => {
        return () => {
            revokeBlobUrls(previewsRef.current);
        };
    }, []);

    const updateField = useCallback(<K extends keyof StoreConfigFormState>(
        field: K,
        value: StoreConfigFormState[K]
    ) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    const createImageHandler = useCallback(
        (
            fileField: "logo" | "bannerHero" | "bannerHeroMobile" | "bannerSecondary" | "bannerTertiary",
            clearField: keyof StoreConfigFormState | null,
            setPreview: React.Dispatch<React.SetStateAction<string | null>>,
            inputRef: React.RefObject<HTMLInputElement | null>,
            _originalUrl: string | null | undefined
        ) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0] ?? null;

                if (!file) return;

                if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                    toast?.showToast({ type: "error", message: "Formato inválido. Use JPEG, PNG ou WebP." });
                    if (inputRef.current) inputRef.current.value = "";
                    return;
                }

                filesRef.current[fileField] = file;
                setPreview((prev) => {
                    if (prev && isObjectUrl(prev)) URL.revokeObjectURL(prev);
                    return URL.createObjectURL(file);
                });
                setForm((prev) => ({
                    ...prev,
                    [fileField]: file,
                    ...(clearField ? { [clearField]: false } : {}),
                }));
            },
        [toast]
    );

    const createRemoveHandler = useCallback(
        (
            fileField: "logo" | "bannerHero" | "bannerHeroMobile" | "bannerSecondary" | "bannerTertiary",
            clearField: keyof StoreConfigFormState,
            setPreview: React.Dispatch<React.SetStateAction<string | null>>,
            inputRef: React.RefObject<HTMLInputElement | null>
        ) =>
            () => {
                filesRef.current[fileField] = null;
                setPreview((prev) => {
                    if (prev && isObjectUrl(prev)) URL.revokeObjectURL(prev);
                    return null;
                });
                setForm((prev) => ({
                    ...prev,
                    [fileField]: null,
                    [clearField]: true,
                }));
                if (inputRef.current) inputRef.current.value = "";
            },
        []
    );

    const handleLogoChange = createImageHandler("logo", null, setLogoPreview, logoInputRef, model?.logoUrl);
    const handleBannerHeroChange = createImageHandler("bannerHero", "bannerHeroClear", setBannerHeroPreview, bannerHeroInputRef, model?.bannerHeroURL);
    const handleBannerHeroMobileChange = createImageHandler("bannerHeroMobile", "bannerHeroMobileClear", setBannerHeroMobilePreview, bannerHeroMobileInputRef, model?.bannerHeroMobileURL);
    const handleBannerSecondaryChange = createImageHandler("bannerSecondary", "bannerSecondaryClear", setBannerSecondaryPreview, bannerSecondaryInputRef, model?.bannerSecondaryURL);
    const handleBannerTertiaryChange = createImageHandler("bannerTertiary", "bannerTertiaryClear", setBannerTertiaryPreview, bannerTertiaryInputRef, model?.bannerTertiaryURL);

    const removeBannerHero = createRemoveHandler("bannerHero", "bannerHeroClear", setBannerHeroPreview, bannerHeroInputRef);
    const removeBannerHeroMobile = createRemoveHandler("bannerHeroMobile", "bannerHeroMobileClear", setBannerHeroMobilePreview, bannerHeroMobileInputRef);
    const removeBannerSecondary = createRemoveHandler("bannerSecondary", "bannerSecondaryClear", setBannerSecondaryPreview, bannerSecondaryInputRef);
    const removeBannerTertiary = createRemoveHandler("bannerTertiary", "bannerTertiaryClear", setBannerTertiaryPreview, bannerTertiaryInputRef);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form.primaryColor.trim()) {
            toast?.showToast({ type: "error", message: "A cor primária é obrigatória" });
            return;
        }
        if (!form.secondaryColor.trim()) {
            toast?.showToast({ type: "error", message: "A cor secundária é obrigatória" });
            return;
        }
        const logoFile = filesRef.current.logo ?? form.logo;
        if (!logoFile && !model?.logoUrl) {
            toast?.showToast({ type: "error", message: "A logo é obrigatória" });
            return;
        }

        setIsLoading(true);

        try {
            const fd = new FormData();
            fd.set("primaryColor", form.primaryColor.trim());
            fd.set("secondaryColor", form.secondaryColor.trim());
            const bannerHeroFile = filesRef.current.bannerHero ?? form.bannerHero;
            const bannerHeroMobileFile = filesRef.current.bannerHeroMobile ?? form.bannerHeroMobile;
            const bannerSecondaryFile = filesRef.current.bannerSecondary ?? form.bannerSecondary;
            const bannerTertiaryFile = filesRef.current.bannerTertiary ?? form.bannerTertiary;
            if (logoFile) fd.append("logo", logoFile, logoFile.name);
            if (bannerHeroFile) fd.append("bannerHero", bannerHeroFile, bannerHeroFile.name);
            if (bannerHeroMobileFile) fd.append("bannerHeroMobile", bannerHeroMobileFile, bannerHeroMobileFile.name);
            if (bannerSecondaryFile) fd.append("bannerSecondary", bannerSecondaryFile, bannerSecondaryFile.name);
            if (bannerTertiaryFile) fd.append("bannerTertiary", bannerTertiaryFile, bannerTertiaryFile.name);
            if (form.bannerHeroClear) fd.set("bannerHeroClear", "true");
            if (form.bannerHeroMobileClear) fd.set("bannerHeroMobileClear", "true");
            if (form.bannerSecondaryClear) fd.set("bannerSecondaryClear", "true");
            if (form.bannerTertiaryClear) fd.set("bannerTertiaryClear", "true");

            const result = await updateStoreConfigAction(fd);

            if (result.success) {
                toast?.showToast({ type: "success", message: "Configurações da loja atualizadas com sucesso!" });
                filesRef.current = {
                    logo: null,
                    bannerHero: null,
                    bannerHeroMobile: null,
                    bannerSecondary: null,
                    bannerTertiary: null,
                };
                router.refresh();
            } else {
                const errorMessage =
                    result.errors.global?.[0] ??
                    result.errors.primaryColor?.[0] ??
                    result.errors.secondaryColor?.[0] ??
                    result.errors.logo?.[0] ??
                    result.errors.bannerHero?.[0] ??
                    result.errors.bannerHeroMobile?.[0] ??
                    result.errors.bannerSecondary?.[0] ??
                    result.errors.bannerTertiary?.[0] ??
                    "Erro ao atualizar configurações";
                toast?.showToast({ type: "error", message: errorMessage });
            }
        } catch {
            toast?.showToast({ type: "error", message: "Erro inesperado ao atualizar configurações" });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        form,
        updateField,
        logoPreview,
        bannerHeroPreview,
        bannerHeroMobilePreview,
        bannerSecondaryPreview,
        bannerTertiaryPreview,
        handleLogoChange,
        handleBannerHeroChange,
        handleBannerHeroMobileChange,
        handleBannerSecondaryChange,
        handleBannerTertiaryChange,
        removeBannerHero,
        removeBannerHeroMobile,
        removeBannerSecondary,
        removeBannerTertiary,
        logoInputRef,
        bannerHeroInputRef,
        bannerHeroMobileInputRef,
        bannerSecondaryInputRef,
        bannerTertiaryInputRef,
        isLoading,
        handleSubmit,
    };
}
