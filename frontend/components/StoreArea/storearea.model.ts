export interface StoreData {
    name: string;
    email: string;
    number: string;
    description: string;
    typeMarket: string;
}

export interface StoreAreaProps {
    store: StoreData | undefined | null;
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
