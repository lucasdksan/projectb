export interface ProductSearchModel {
    storeSlug: string;
    primaryColor: string;
    placeholder?: string;
}

export interface ProductSearchViewProps extends ProductSearchModel {};