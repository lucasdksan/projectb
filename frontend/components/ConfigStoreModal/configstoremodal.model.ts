export interface ConfigStoreModel {
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
}

export interface ConfigStoreFormState {
    primaryColor: string;
    secondaryColor: string;
    logo: File | null;
}

export const defaultConfigStoreForm: ConfigStoreFormState = {
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    logo: null,
};

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ACCEPTED_IMAGE_EXT = ".jpg,.jpeg,.png,.webp";
