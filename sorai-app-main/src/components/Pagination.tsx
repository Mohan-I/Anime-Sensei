"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function computePageSlots(currentPage: number, totalPages: number): (number | "ellipsis")[] {
    const maxVisible = 5;
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= maxVisible + 2) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (currentPage > 3) pages.push("ellipsis");
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (currentPage < totalPages - 2) pages.push("ellipsis");
        pages.push(totalPages);
    }

    return pages;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const slots = computePageSlots(currentPage, totalPages);

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-text-secondary hover:bg-surface-alt disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft size={16} />
            </button>

            {slots.map((slot, i) =>
                slot === "ellipsis" ? (
                    <span
                        key={`ellipsis-${i}`}
                        className="w-9 h-9 flex items-center justify-center text-text-secondary text-sm"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={slot}
                        onClick={() => onPageChange(slot)}
                        className="w-9 h-9 rounded-xl text-sm transition-colors"
                        style={{
                            backgroundColor: currentPage === slot ? "var(--color-primary)" : "transparent",
                            color: currentPage === slot ? "white" : "var(--color-text-secondary)",
                            border: currentPage === slot ? "none" : "1px solid var(--color-border)",
                        }}
                    >
                        {slot}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-text-secondary hover:bg-surface-alt disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
}
