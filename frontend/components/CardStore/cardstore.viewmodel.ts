import type { CardStoreDisplay, CardStoreModel } from "./cardstore.model";

const DEFAULT_PRIMARY = "#ea1d2c";
const DEFAULT_SECONDARY = "#c91828";

export function formatCardStoreDisplay(model: CardStoreModel): CardStoreDisplay {
    const parts: string[] = [];
    if (model.email) parts.push(model.email);
    if (model.number) parts.push(model.number);
    const contactLine = parts.join(" • ");

    return {
        name: model.name,
        image: model.image,
        description: model.description,
        contactLine,
        primaryColor: model.primaryColor ?? DEFAULT_PRIMARY,
        secondaryColor: model.secondaryColor ?? DEFAULT_SECONDARY,
    };
}
