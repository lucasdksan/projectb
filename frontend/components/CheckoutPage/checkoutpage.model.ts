export interface CheckoutPageModel {
    storeSlug: string;
    storeName: string;
    primaryColor: string;
    secondaryColor: string;
}

export interface CheckoutPageViewProps extends CheckoutPageModel {};