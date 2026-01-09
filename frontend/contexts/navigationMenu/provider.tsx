"use client";

import { useState, useMemo, useCallback } from "react";
import { NavigationMenuContext } from "./context";

export function NavigationMenuProvider({ children }: { children: React.ReactNode }){
    const [stateMenu, setStateMenuDefault] = useState(false);
    
    const setStateMenu = useCallback((newState: boolean) => {
        setStateMenuDefault(newState);
    }, []);

    const value = useMemo(() => ({
        stateMenu,
        setStateMenu
    }), [stateMenu, setStateMenu]);
    
    return(
        <NavigationMenuContext.Provider value={value}>
            { children }
        </NavigationMenuContext.Provider>
    );
}