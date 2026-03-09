export interface CardStoreModel {
    name: string;
    email: string;
    number: string;
    description: string;
    image: string;
    primaryColor?: string;
    secondaryColor?: string;
}

export interface CardStoreDisplay {
    name: string;
    image: string;
    description: string;
    contactLine: string;
    primaryColor: string;
    secondaryColor: string;
}