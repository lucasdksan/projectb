import { useToast } from "@/frontend/hooks/useToast";

export default function useContainerViewModel() {
    const context = useToast();

    if (!context) return null;

    const { toasts, removeToast } = context;

    return {
        toasts,
        removeToast,
    }
}