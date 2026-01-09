"use client";

import { createContext } from "react";

interface NavigationMenuContextProps {
    stateMenu: boolean;
    setStateMenu: (valeu: boolean) => void;
};

export const NavigationMenuContext = createContext<NavigationMenuContextProps>({
    stateMenu: true,
    setStateMenu: () => null,
});