"use client";

import Link from "next/link";

interface PaginationProps {
    page: number;
    limit: number;
    total: number;
}

export default function Pagination({ page, limit, total }: PaginationProps) {
    const totalPages = Math.ceil(total / limit);

    return (
        <div className="flex gap-2">
            <Link
                href={`?page=${page - 1}`}
                className="px-3 py-1 border rounded-lg border-slate-300 disabled:text-slate-300"
                aria-disabled={page <= 1}
            >
                ←
            </Link>
            <Link
                href={`?page=${page + 1}`}
                className="px-3 py-1 border rounded-lg border-slate-300 disabled:text-slate-300"
                aria-disabled={page >= totalPages}
            >
                →
            </Link>
        </div>
    );
}
