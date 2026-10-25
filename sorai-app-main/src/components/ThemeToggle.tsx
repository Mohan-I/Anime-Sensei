"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/lib/user-profile";

export default function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const { user, supabase, refreshProfile, applyProfileUpdate } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-border hover:bg-surface-alt transition-colors">
                <span className="w-4 h-4" />
            </button>
        );
    }

    const isDark = resolvedTheme === "dark";
    const nextTheme = isDark ? "light" : "dark";

    const handleToggle = async () => {
        setTheme(nextTheme);

        if (!user) return;

        applyProfileUpdate({ theme_preference: nextTheme });

        try {
            await updateUserProfile(supabase, user.id, {
                theme_preference: nextTheme,
            });
            await refreshProfile();
        } catch {
            // Keep the local theme change even if the database has not been migrated yet.
        }
    };

    return (
        <button
            onClick={handleToggle}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-border hover:bg-surface-alt transition-colors"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDark ? (
                <Sun size={16} className="text-text-secondary" />
            ) : (
                <Moon size={16} className="text-text-secondary" />
            )}
        </button>
    );
}
