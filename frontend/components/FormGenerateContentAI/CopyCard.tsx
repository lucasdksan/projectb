"use client";

import { useState } from "react";
import WhiteCard from "../WhiteCard";

interface CopyCardProps {
    title: string;
    value: string;
    activeBold: boolean;
    rows: number;
}

export default function CopyCard({ title, value, activeBold, rows }: CopyCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <WhiteCard>
            <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    {title}
                </h3>

                <div className="flex items-center gap-2">
                    {copied && (
                        <span className="text-xs text-green-600">
                            Copiado!
                        </span>
                    )}
                    <button
                        onClick={handleCopy}
                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        📋
                    </button>
                </div>
            </div>

            <textarea
                rows={rows}
                defaultValue={value}
                className={`w-full bg-background text-text-main border-0 rounded-lg p-3 text-lg ${activeBold ? "font-bold" : "font-normal"} resize-none focus:ring-2 focus:ring-primary/50`}
            />
        </WhiteCard>
    );
}