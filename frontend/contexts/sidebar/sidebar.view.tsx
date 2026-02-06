"use client";

import useSidebarViewModel, { SidebarContext } from "./sidebar.viewmodel";

export default function SidebarView({ children }: { children: React.ReactNode }) {
    const { value } = useSidebarViewModel();

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    )
}