"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";

interface FilterOption {
    value: string;
    label: string;
}

export interface ActiveFilters {
    type: string;
    genre: string;
    demographic: string;
    status: string;
}

interface FilterDropdownProps {
    label: string;
    options: readonly FilterOption[];
    value: string;
    onChange: (value: string) => void;
}

function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const activeOption = options.find((o) => o.value === value);
    const isActive = value !== "all";

    // Close on click outside
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open]);

    const handleSelect = (val: string) => {
        onChange(val);
        setOpen(false);
    };

    return (
        <div className="filter-dropdown" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className={`filter-dropdown__trigger ${isActive ? "filter-dropdown__trigger--active" : ""}`}
            >
                <span className="filter-dropdown__label">
                    {isActive ? activeOption?.label : label}
                </span>
                <ChevronDown
                    size={13}
                    className="filter-dropdown__chevron"
                    style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
                />
            </button>

            {open && (
                <div className="filter-dropdown__panel">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            className={`filter-dropdown__item ${value === option.value ? "filter-dropdown__item--selected" : ""}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

interface FilterBarProps {
    filters: ActiveFilters;
    onChange: (filters: ActiveFilters) => void;
    /** Which dropdown filters to show besides the "All" reset button */
    visibleFilters?: Array<"type" | "genre" | "demographic" | "status">;
    /** Filter option lists */
    typeOptions?: readonly FilterOption[];
    genreOptions?: readonly FilterOption[];
    demographicOptions?: readonly FilterOption[];
    statusOptions?: readonly FilterOption[];
}

const DEFAULT_FILTERS: ActiveFilters = {
    type: "all",
    genre: "all",
    demographic: "all",
    status: "all",
};

export default function FilterBar({
    filters,
    onChange,
    visibleFilters = ["genre", "demographic", "type", "status"],
    typeOptions = [],
    genreOptions = [],
    demographicOptions = [],
    statusOptions = [],
}: FilterBarProps) {
    const hasActiveFilter = Object.values(filters).some((v) => v !== "all");

    const handleReset = useCallback(() => {
        onChange({ ...DEFAULT_FILTERS });
    }, [onChange]);

    const handleChange = useCallback(
        (key: keyof ActiveFilters, value: string) => {
            onChange({ ...filters, [key]: value });
        },
        [filters, onChange]
    );

    return (
        <div className="filter-bar">
            {/* All / Reset button */}
            <button
                onClick={handleReset}
                className={`filter-bar__all ${!hasActiveFilter ? "filter-bar__all--active" : ""}`}
            >
                All
            </button>

            {visibleFilters.includes("genre") && genreOptions.length > 0 && (
                <FilterDropdown
                    label="Genre"
                    options={genreOptions}
                    value={filters.genre}
                    onChange={(v) => handleChange("genre", v)}
                />
            )}

            {visibleFilters.includes("demographic") && demographicOptions.length > 0 && (
                <FilterDropdown
                    label="Demographic"
                    options={demographicOptions}
                    value={filters.demographic}
                    onChange={(v) => handleChange("demographic", v)}
                />
            )}

            {visibleFilters.includes("type") && typeOptions.length > 0 && (
                <FilterDropdown
                    label="Type"
                    options={typeOptions}
                    value={filters.type}
                    onChange={(v) => handleChange("type", v)}
                />
            )}

            {visibleFilters.includes("status") && statusOptions.length > 0 && (
                <FilterDropdown
                    label="Status"
                    options={statusOptions}
                    value={filters.status}
                    onChange={(v) => handleChange("status", v)}
                />
            )}
        </div>
    );
}

export { DEFAULT_FILTERS };
