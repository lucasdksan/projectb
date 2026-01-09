"use client";

import { Toast } from "@/frontend/components/Toast/schema";
import { createContext } from "react";

interface ToastContextProps {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextProps | null>(null);
