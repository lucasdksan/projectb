export interface StoreHeaderModel {
    storeSlug: string;
    storeName: string;
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
}

export interface StoreHeaderViewProps extends StoreHeaderModel {};