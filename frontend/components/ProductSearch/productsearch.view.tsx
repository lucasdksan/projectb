"use client";

import { Search } from "lucide-react";
import { useProductSearchViewModel } from "./productsearch.viewmodel";
import type { ProductSearchViewProps } from "./productsearch.model";

export default function ProductSearchView(props: ProductSearchViewProps) {
    const {
        value,
        onChange,
        onFocus,
        onBlur,
        onKeyDown,
        placeholder,
        results,
        isLoading,
        isPopupOpen,
        selectProduct,
        containerRef,
    } = useProductSearchViewModel(props);

    const showPopup =
        isPopupOpen &&
        (isLoading || results.length > 0 || (value.trim().length > 0 && !isLoading));

    return (
        <div ref={containerRef} className="flex-1 min-w-0 max-w-md relative">
            <div className="relative">
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full bg-white border border-gray-300 rounded-full py-2 pl-10 pr-4 text-gray-900 placeholder:text-gray-600 focus:ring-2 focus:ring-opacity-50 focus:border-gray-400 transition-all outline-none"
                    style={
                        {
                            "--tw-ring-color": props.primaryColor,
                        } as React.CSSProperties
                    }
                    value={value}
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onKeyDown={onKeyDown}
                />
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                    size={18}
                />
            </div>

            {showPopup && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            Buscando...
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            Nenhum produto encontrado
                        </div>
                    ) : (
                        <ul className="py-2">
                            {results.map((product) => (
                                <li key={product.id}>
                                    <button
                                        type="button"
                                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            selectProduct(product);
                                        }}
                                    >
                                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                                            {product.images[0]?.url ? (
                                                <img
                                                    src={product.images[0].url}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                    referrerPolicy="no-referrer"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                    —
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">
                                                {product.name}
                                            </p>
                                            <p
                                                className="text-sm font-bold mt-0.5"
                                                style={{
                                                    color: props.primaryColor,
                                                }}
                                            >
                                                R${" "}
                                                {product.price.toLocaleString(
                                                    "pt-BR",
                                                    {
                                                        minimumFractionDigits:
                                                            2,
                                                    }
                                                )}
                                            </p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
