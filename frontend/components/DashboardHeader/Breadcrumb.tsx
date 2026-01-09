"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
    const pathname = usePathname();

    const paths = pathname
        .split("/")
        .filter(Boolean);

    return (
        <nav aria-label="Breadcrumb" className="hidden lg:flex">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <li>
                    <Link href="/" className="hover:underline">
                        Home
                    </Link>
                </li>

                {paths.map((segment, index) => {
                    const href = "/" + paths.slice(0, index + 1).join("/")
                    const isLast = index === paths.length - 1

                    const label = decodeURIComponent(segment)
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, l => l.toUpperCase())

                    return (
                        <li key={href} className="flex items-center gap-2">
                            <span>/</span>
                            {isLast ? (
                                <span className="font-medium text-gray-900">
                                    {label}
                                </span>
                            ) : (
                                <Link href={href} className="hover:underline">
                                    {label}
                                </Link>
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    );
}