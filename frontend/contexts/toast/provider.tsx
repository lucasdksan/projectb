"use client";

import { Toast } from "@/frontend/components/Toast/schema";
import { useCallback, useState, useMemo, useRef, useEffect } from "react";
import { ToastContext } from "./context";
import { ToastContainer } from "@/frontend/components/Toast";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const removeToast = useCallback((id: string) => {
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
    
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = crypto.randomUUID();

      setToasts((prev) => [...prev, { ...toast, id }]);

      const timeout = setTimeout(() => {
        removeToast(id);
      }, toast.duration ?? 4000);
      
      timeoutsRef.current.set(id, timeout);
    },
    [removeToast]
  );

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => {
        clearTimeout(timeout);
      });
      timeoutsRef.current.clear();
    };
  }, []);

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      removeToast,
    }),
    [toasts, showToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}
