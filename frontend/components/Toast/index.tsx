"use client";

import clsx from "clsx";
import { useContext } from "react";
import { ToastContext } from "@/frontend/contexts/toast/context";

const styles = {
  success: "bg-green-600",
  error: "bg-red-600",
  warning: "bg-yellow-500 text-black",
  info: "bg-blue-600",
};

export function ToastContainer() {
  const context = useContext(ToastContext);
  if (!context) return null;

  const { toasts, removeToast } = context;

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            "min-w-[300px] rounded-lg p-4 shadow-lg text-white animate-slide-in",
            styles[toast.type]
          )}
        >
          <div className="flex justify-between items-start">
            <div>
              {toast.title && (
                <p className="font-semibold mb-1">{toast.title}</p>
              )}
              <p className="text-sm">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
