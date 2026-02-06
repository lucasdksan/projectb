"use client";

import { useContext } from "react";
import { SidebarContext } from "../contexts/sidebar/sidebar.viewmodel";

export function useSidebar() {
    const context = useContext(SidebarContext);

    if (!context) return null;

    return context;
}