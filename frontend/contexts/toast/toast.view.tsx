"use client";

import ContainerView from "./components/Container/container.view";
import useToastViewModel, { ToastContext } from "./toast.viewmodel";

export default function ToastView({ children }: { children: React.ReactNode }) {
    const { value } = useToastViewModel();

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ContainerView />
        </ToastContext.Provider>
    );
}