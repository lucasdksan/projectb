"use client";

import { useContext } from "react";
import { ToastContext } from "../contexts/toast/toast.viewmodel";

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) return null;

    return context;
}