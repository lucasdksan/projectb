"use client";

import type { StoreHeaderModel } from "./storeheader.model";

export function useStoreHeaderViewModel(model: StoreHeaderModel) {
    return {
        storeSlug: model.storeSlug,
        storeName: model.storeName,
        logoUrl: model.logoUrl,
        primaryColor: model.primaryColor,
        secondaryColor: model.secondaryColor,
    };
}
