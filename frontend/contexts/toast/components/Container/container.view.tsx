"use client";

import clsx from "clsx";
import useContainerViewModel from "./container.viewmodel";
import { STYLES_CONTAINER } from "./container.model";

export default function ContainerView() {
    const viewModel = useContainerViewModel();

    if (!viewModel) return null;

    const { toasts, removeToast } = viewModel;

    return (
        <div className="fixed top-6 right-6 z-50 space-y-3">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={clsx(
                        "min-w-[300px] rounded-lg p-4 shadow-lg text-white animate-slide-in",
                        STYLES_CONTAINER[toast.type]
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
    )
}