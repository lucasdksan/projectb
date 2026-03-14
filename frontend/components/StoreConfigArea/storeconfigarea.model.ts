export interface StoreConfigModel {
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
    bannerHeroURL?: string | null;
    bannerHeroMobileURL?: string | null;
    bannerSecondaryURL?: string | null;
    bannerTertiaryURL?: string | null;
}

export interface StoreConfigFormState {
    primaryColor: string;
    secondaryColor: string;
    logo: File | null;
    bannerHero: File | null;
    bannerHeroMobile: File | null;
    bannerSecondary: File | null;
    bannerTertiary: File | null;
    bannerHeroClear: boolean;
    bannerHeroMobileClear: boolean;
    bannerSecondaryClear: boolean;
    bannerTertiaryClear: boolean;
}

export const defaultStoreConfigForm: StoreConfigFormState = {
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
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

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ACCEPTED_IMAGE_EXT = ".jpg,.jpeg,.png,.webp";
export interface StoreConfigAreaProps {
    config: StoreConfigModel | null;
}