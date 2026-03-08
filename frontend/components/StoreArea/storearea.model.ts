export interface StoreAreaProps {
    store: {
        name: string;
        email: string;
        number: string;
        description: string;
        typeMarket: string;
        primaryColor?: string;
        secondaryColor?: string;
        logoUrl?: string;
    } | undefined | null;
}   

export type StoreFormState = {
    name: string;
    email: string;
    number: string;
    description: string;
    typeMarket: string;
};

export const defaultStoreForm: StoreFormState = {
    name: "",
    email: "",
    number: "",
    description: "",
    typeMarket: "",
};