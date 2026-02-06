import { createContext, useMemo, useCallback, useState } from "react";
import { Sidebar } from "./sidebar.model";

export const SidebarContext = createContext<Sidebar | undefined>(undefined);

export default function useSidebarViewModel() {
    const [stateMenu, setStateMenuDefault] = useState(false);

    const setStateMenu = useCallback((newState: boolean) => {
        setStateMenuDefault(newState);
    }, []);

    const value = useMemo(() => ({
        stateMenu,
        setStateMenu
    }), [stateMenu, setStateMenu]);

    return {
        value,
    }
}