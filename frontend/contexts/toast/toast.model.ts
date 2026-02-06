export type ToastType = "success" | "error" | "warning" | "info";

export type Toast = {
    id: string;
    title?: string;
    message: string;
    type: ToastType;
    duration?: number;
}

export type ToastContextProps = {
    toasts: Toast[];
    showToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
}